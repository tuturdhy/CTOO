// Configuration du questionnaire de santé

export const SURVEY_QUESTIONS = {
  hasPain: {
    question: 'Avez-vous des douleurs, blessures ou limitations physiques ?',
    type: 'boolean',
    options: ['Oui', 'Non']
  },
  painAreas: {
    question: 'Dans quelles zones ressentez-vous des douleurs ou limitations ?',
    type: 'multiple',
    options: [
      { id: 'knee-pain', label: 'Douleurs aux genoux' },
      { id: 'back-pain', label: 'Douleurs au dos / colonne vertébrale' },
      { id: 'shoulder-pain', label: 'Douleurs aux épaules' },
      { id: 'ankle-hip-pain', label: 'Problèmes de cheville / hanche' },
      { id: 'pregnancy', label: 'Grossesse / post-partum' },
      { id: 'recent-surgery', label: 'Blessure récente / chirurgie' }
    ]
  },
  fitnessLevel: {
    question: 'Quel est votre niveau de forme ?',
    type: 'single',
    options: [
      { id: 'beginner', label: 'Débutant' },
      { id: 'intermediate', label: 'Intermédiaire' },
      { id: 'advanced', label: 'Avancé' }
    ]
  },
  goal: {
    question: 'Quel est votre objectif principal ?',
    type: 'single',
    options: [
      { id: 'strength', label: 'Renforcement' },
      { id: 'flexibility', label: 'Souplesse' },
      { id: 'rehabilitation', label: 'Rééducation' },
      { id: 'injury-prevention', label: 'Prévention des blessures' }
    ]
  }
}

