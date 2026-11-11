// Académie scolaire – École primaire RDC : la structure, EN DONNÉES (aucune logique).
// Référence : Programme national de l'enseignement primaire, Ministère de l'EPSP, Direction des programmes scolaires
// et matériel didactique (2009, archivé à l'UNESCO). Les contenus du jeu sont une adaptation pédagogique ;
// ils n'ont pas encore été vérifiés ligne par ligne avec les manuels officiels (voir docs/ACADEMIE.md).

const CYCLES = [
  { id: 'elementaire', nom: 'Cycle élémentaire', classes: [1, 2], couleur: '#ffb703', icon: '🌱' },
  { id: 'moyen', nom: 'Cycle moyen', classes: [3, 4], couleur: '#06d6a0', icon: '🌿' },
  { id: 'terminal', nom: 'Cycle terminal', classes: [5, 6], couleur: '#9b5de5', icon: '🌳' },
];
const CLASSES_ACAD = [
  { n: 1, nom: '1re primaire', ages: '6-7 ans', couleur: '#ffb703' },
  { n: 2, nom: '2e primaire', ages: '7-8 ans', couleur: '#fb8500' },
  { n: 3, nom: '3e primaire', ages: '8-9 ans', couleur: '#06d6a0' },
  { n: 4, nom: '4e primaire', ages: '9-10 ans', couleur: '#118ab2' },
  { n: 5, nom: '5e primaire', ages: '10-11 ans', couleur: '#9b5de5' },
  { n: 6, nom: '6e primaire', ages: '11-12 ans', couleur: '#e63946' },
];
// complementaire : modules en plus du programme national (clairement signalés)
const MATIERES_ACAD = [
  { id: 'fr', nom: 'Français', icon: '📘', couleur: '#3a86ff' },
  { id: 'ma', nom: 'Mathématiques', icon: '🔢', couleur: '#ef476f' },
  { id: 'st', nom: 'Sciences et technologie', icon: '🔬', couleur: '#06a77d' },
  { id: 'hi', nom: 'Histoire', icon: '🏛️', couleur: '#b5838d' },
  { id: 'ge', nom: 'Géographie', icon: '🗺️', couleur: '#2a9d8f' },
  { id: 'ec', nom: 'Éducation civique et morale', icon: '🤝', couleur: '#f4a261' },
  { id: 'ln', nom: 'Langues nationales', icon: '🗣️', couleur: '#8338ec' },
  { id: 'ar', nom: 'Éducation artistique', icon: '🎨', couleur: '#f15bb5' },
  { id: 'ep', nom: 'Éducation physique et sportive', icon: '⚽', couleur: '#43aa8b' },
  { id: 'tp', nom: 'Initiation aux travaux productifs', icon: '🌾', couleur: '#bc6c25' },
  { id: 'an', nom: 'Anglais', icon: '🇬🇧', couleur: '#457b9d', complementaire: true },
  { id: 'in', nom: 'Informatique et culture numérique', icon: '💻', couleur: '#6c757d', complementaire: true },
];

// Notation : quiz de 5 questions × 4 points = 20 ; seuil de validation 14/20
const QUIZ = { questions: 5, points: 4, seuil: 14 };
const BAREME = [
  { min: 18, nom: 'Excellent', maitrise: 'Maîtrisé', couleur: '#06d6a0' },
  { min: 16, nom: 'Très bien', maitrise: 'Maîtrisé', couleur: '#52b788' },
  { min: 14, nom: 'Bien', maitrise: 'Acquis', couleur: '#90be6d' },
  { min: 10, nom: 'À renforcer', maitrise: 'En cours d’acquisition', couleur: '#f9c74f' },
  { min: 0, nom: 'Insuffisant', maitrise: 'Non acquis', couleur: '#f94144' },
];
// Périodes du bulletin (année scolaire de septembre à juillet)
const PERIODES = [
  { id: 'T1', nom: '1er trimestre', mois: [9, 10, 11, 12] },
  { id: 'T2', nom: '2e trimestre', mois: [1, 2, 3] },
  { id: 'T3', nom: '3e trimestre', mois: [4, 5, 6, 7, 8] },
];
// Examen de fin d'année : 20 questions d'1 point, chronométré
const EXAMEN = { questions: 20, minutes: 30, seuil: 10 }; // seuil : 10/20 pour passer en classe supérieure
// Préparation à l'ENAFEP (6e primaire) : examens blancs d'entraînement, NON officiels.
// Trois domaines, comme la session officielle : français, mathématiques, culture générale.
const ENAFEP = {
  avertissement: 'Examen blanc d’entraînement : il n’est pas une épreuve officielle de l’ENAFEP.',
  domaines: [
    { id: 'fr', nom: 'Français', matieres: ['fr'], questions: 20, minutes: 25 },
    { id: 'ma', nom: 'Mathématiques', matieres: ['ma'], questions: 20, minutes: 30 },
    { id: 'cg', nom: 'Culture générale', matieres: ['hi', 'ge', 'st', 'ec'], questions: 20, minutes: 25 },
  ],
};
// Test de positionnement : 4 questions par classe (2 en français, 2 en mathématiques)
const POSITIONNEMENT = { parClasse: 4, seuil: 3 };

// Récompenses : elles récompensent la réussite et la régularité, jamais la vitesse
const BADGES = [
  { id: 'lecture', nom: 'Champion de lecture', icon: '📚', regle: { matiere: 'fr', lecons: 5 } },
  { id: 'maths', nom: 'Génie des mathématiques', icon: '🧮', regle: { matiere: 'ma', lecons: 8 } },
  { id: 'sciences', nom: 'Petit scientifique', icon: '🔬', regle: { matiere: 'st', lecons: 4 } },
  { id: 'rdc', nom: 'Explorateur de la RDC', icon: '🧭', regle: { matieres: ['hi', 'ge'], lecons: 4 } },
  { id: 'civisme', nom: 'Champion de civisme', icon: '🤝', regle: { matiere: 'ec', lecons: 3 } },
  { id: 'excellent', nom: 'Excellent élève', icon: '🏅', regle: { moyenne: 16, quiz: 10 } },
  { id: 'sansfaute', nom: 'Sans faute', icon: '🎯', regle: { notePleine: 1 } },
  { id: 'serie', nom: 'Belle série', icon: '🔥', regle: { serieQuiz: 5 } },
  { id: 'regulier3', nom: 'Élève régulier', icon: '📅', regle: { joursSuite: 3 } },
  { id: 'regulier7', nom: 'Une semaine d’efforts', icon: '🗓️', regle: { joursSuite: 7 } },
  { id: 'persevere', nom: 'Persévérant', icon: '💪', regle: { reussiApresEchec: 1 } },
  { id: 'positionne', nom: 'Je connais mon niveau', icon: '🧪', regle: { positionnement: 1 } },
];
