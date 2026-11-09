# Découpe une planche (personnages côte à côte sur fond magenta) en sprites WebP transparents.
# Usage : python3 -I planche.py planche.png dossier_sortie pose1 pose2 ...  (de gauche à droite)
import sys, os
import numpy as np
from PIL import Image, ImageFilter
src, out_dir, poses = sys.argv[1], sys.argv[2], sys.argv[3:]
os.makedirs(out_dir, exist_ok=True)
im = Image.open(src).convert('RGB'); a = np.asarray(im).astype(np.float32)
bord = np.concatenate([a[0], a[-1], a[:, 0], a[:, -1]]); fond = np.median(bord, axis=0)
d = np.sqrt(((a - fond) ** 2).sum(axis=2))
alpha = np.clip((d - 80) / 70, 0, 1)
r, g, b = a[..., 0], a[..., 1], a[..., 2]
spill = np.clip(np.minimum(r, b) - g, 0, None)
k = np.where(alpha < 0.98, 1.0, 0.25)
a[..., 0] -= spill * k; a[..., 2] -= spill * k
m = Image.fromarray((alpha * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(5)).filter(ImageFilter.GaussianBlur(.6))
rgba = Image.fromarray(np.dstack([np.clip(a, 0, 255), np.asarray(m)]).astype(np.uint8), 'RGBA')
# Découpe en n parts aux colonnes les moins remplies (les personnages peuvent se toucher)
n = len(poses)
mask = np.asarray(m) > 40
mass = mask.sum(axis=0).astype(float)
W = len(mass)
lisse = np.convolve(mass, np.ones(9) / 9, mode='same')
xs = np.where(mass > 2)[0]; gauche, droite = xs.min(), xs.max()
cuts = []
pas = (droite - gauche) / n
for k in range(1, n):
    c = gauche + k * pas; lo, hi = int(c - pas * .45), int(c + pas * .45)
    cuts.append(lo + int(np.argmin(lisse[lo:hi])))
bornes = [0] + cuts + [W]
fus = [[bornes[i], bornes[i + 1]] for i in range(n)]
# Si les personnages sont bien séparés par des bandes vides, on coupe dans ces bandes (objets de largeurs différentes)
occ = mass > 2; grp = []; x = 0
while x < W:
    if occ[x]:
        x0 = x
        while x < W and occ[x]: x += 1
        if grp and x0 - grp[-1][1] < 12: grp[-1][1] = x
        else: grp.append([x0, x])
    else: x += 1
grp = [g for g in grp if g[1] - g[0] > 25]
if len(grp) == n:
    fus = [[(grp[i - 1][1] + grp[i][0]) // 2 if i else 0, (grp[i][1] + grp[i + 1][0]) // 2 if i < n - 1 else W] for i in range(n)]
from collections import deque
def nettoie(seg):
    # Retire les petits morceaux d'un voisin qui touchent le bord gauche/droit de la part
    A = np.asarray(seg.getchannel('A')) > 40
    sm = A[::2, ::2].copy(); H2, W2 = sm.shape
    lab = np.zeros(sm.shape, np.int32); tailles = [0]; bords = [False]; cur = 0
    for y0 in range(H2):
        for x0 in np.where(sm[y0] & (lab[y0] == 0))[0]:
            if lab[y0, x0]: continue
            cur += 1; q = deque([(y0, x0)]); lab[y0, x0] = cur; t = 0; bd = False
            while q:
                y, x = q.popleft(); t += 1
                if x == 0 or x == W2 - 1: bd = True
                for yy, xx in ((y+1,x),(y-1,x),(y,x+1),(y,x-1)):
                    if 0 <= yy < H2 and 0 <= xx < W2 and sm[yy, xx] and not lab[yy, xx]:
                        lab[yy, xx] = cur; q.append((yy, xx))
            tailles.append(t); bords.append(bd)
    if cur == 0: return seg
    gros = max(tailles)
    jeter = [i for i in range(1, cur + 1) if (bords[i] and tailles[i] < gros * .25) or tailles[i] < gros * .002]
    if not jeter: return seg
    kill = np.isin(lab, jeter).repeat(2, 0).repeat(2, 1)[:A.shape[0], :A.shape[1]]
    al = np.asarray(seg.getchannel('A')).copy(); al[kill] = 0
    seg.putalpha(Image.fromarray(al)); return seg
print('groupes', len(fus), 'poses', len(poses))
for (x0, x1), pose in zip(fus, poses):
    s = nettoie(rgba.crop((x0, 0, x1, rgba.height)))
    bb = s.getchannel('A').point(lambda v: 255 if v > 24 else 0).getbbox()
    s = s.crop(bb)
    h = int(os.environ.get('HAUTEUR', 512)); w = max(1, round(s.width * h / s.height)); s = s.resize((w, h), Image.LANCZOS)
    dst = f'{out_dir}/{pose}.webp'
    for q in (86, 80, 72, 64, 56, 48):
        s.save(dst, 'WEBP', quality=q, method=6)
        if os.path.getsize(dst) <= 80 * 1024: break
    print(dst, s.size, os.path.getsize(dst) // 1024, 'Ko')
