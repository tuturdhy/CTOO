// Base de données des exercices avec leurs métadonnées

export const EXERCISES = [
  {
    id: 'squat-modified',
    name: 'Squat modifié',
    description: 'Renforcement des jambes et fessiers avec amplitude réduite',
    duration: 8, // répétitions
    difficulty: 'Débutant',
    category: 'Renforcement',
    svgPhases: ['start', 'down', 'up'], // phases d'animation
    tips: [
      'Poussez avec vos talons',
      'Gardez le regard droit devant vous',
      'Genoux alignés avec les orteils',
      'Dos droit, poitrine relevée'
    ],
    commonErrors: [
      {
        id: 'knees-in',
        name: 'Genoux vers l\'intérieur',
        icon: 'knee-error',
        description: 'Les genoux s\'effondrent vers l\'intérieur'
      },
      {
        id: 'back-round',
        name: 'Dos arrondi',
        icon: 'back-error',
        description: 'Le dos se courbe vers l\'avant'
      },
      {
        id: 'heels-up',
        name: 'Talons décollés',
        icon: 'heel-error',
        description: 'Les talons se soulèvent du sol'
      }
    ],
    angles: {
      knee: { min: 90, max: 180 }, // angle genou (hanche-genou-cheville)
      hip: { min: 120, max: 180 }, // angle hanche
      back: { min: 160, max: 180 } // angle dos (épaule-hanche-cheville)
    },
    recommendations: {
      recommended: ['knee-pain', 'beginner'],
      modified: ['back-pain'],
      avoid: ['recent-surgery', 'severe-knee-pain']
    }
  },
  {
    id: 'glute-bridge',
    name: 'Pont de fessiers',
    description: 'Renforcement des fessiers et ischio-jambiers',
    duration: 10,
    difficulty: 'Débutant',
    category: 'Renforcement',
    svgPhases: ['start', 'up', 'down'],
    tips: [
      'Soulevez les hanches en contractant les fessiers',
      'Gardez les genoux alignés',
      'Ne cambrez pas trop le dos',
      'Contrôlez la descente'
    ],
    commonErrors: [
      {
        id: 'over-arch',
        name: 'Trop de cambrure',
        icon: 'back-error',
        description: 'Le dos est trop cambré'
      }
    ],
    angles: {
      hip: { min: 150, max: 180 }
    },
    recommendations: {
      recommended: ['knee-pain', 'back-pain', 'beginner'],
      modified: [],
      avoid: ['recent-surgery']
    }
  },
  {
    id: 'plank-modified',
    name: 'Planche modifiée',
    description: 'Gainage du tronc en position modifiée',
    duration: 30, // secondes
    difficulty: 'Débutant',
    category: 'Gainage',
    svgPhases: ['start', 'hold'],
    tips: [
      'Corps aligné de la tête aux talons',
      'Contractez les abdominaux',
      'Respirez normalement',
      'Ne laissez pas les hanches s\'affaisser'
    ],
    commonErrors: [
      {
        id: 'hips-sag',
        name: 'Hanches affaissées',
        icon: 'hip-error',
        description: 'Les hanches descendent trop bas'
      },
      {
        id: 'head-down',
        name: 'Tête baissée',
        icon: 'head-error',
        description: 'La tête n\'est pas alignée'
      }
    ],
    angles: {
      back: { min: 170, max: 180 }
    },
    recommendations: {
      recommended: ['back-pain', 'beginner'],
      modified: ['shoulder-pain'],
      avoid: ['recent-surgery']
    }
  },
  {
    id: 'shoulder-rotation',
    name: 'Rotation d\'épaule',
    description: 'Mobilité et renforcement des épaules',
    duration: 12,
    difficulty: 'Débutant',
    category: 'Mobilité',
    svgPhases: ['start', 'forward', 'back'],
    tips: [
      'Mouvements lents et contrôlés',
      'Gardez les coudes près du corps',
      'Ne forcez pas si vous ressentez une douleur'
    ],
    commonErrors: [
      {
        id: 'too-fast',
        name: 'Mouvement trop rapide',
        icon: 'speed-error',
        description: 'Le mouvement doit être lent et contrôlé'
      }
    ],
    angles: {
      shoulder: { min: 0, max: 90 }
    },
    recommendations: {
      recommended: ['shoulder-pain', 'beginner'],
      modified: [],
      avoid: ['recent-surgery']
    }
  }
]

// Fonction pour filtrer les exercices selon le profil utilisateur
export function filterExercisesByProfile(survey) {
  if (!survey || !survey.hasPain) {
    return EXERCISES.map(ex => ({ ...ex, status: 'recommended' }))
  }

  const painAreas = survey.painAreas || []
  const level = survey.fitnessLevel || 'beginner'
  const goal = survey.goal || 'strength'

  return EXERCISES.map(exercise => {
    let status = 'recommended'

    // Vérifier si l'exercice doit être évité
    const shouldAvoid = exercise.recommendations.avoid.some(condition => {
      if (condition === 'recent-surgery' && painAreas.includes('recent-surgery')) return true
      if (condition === 'severe-knee-pain' && painAreas.includes('knee-pain')) return true
      return false
    })

    if (shouldAvoid) {
      status = 'avoid'
    } else if (exercise.recommendations.modified.some(area => painAreas.includes(area))) {
      status = 'modified'
    } else if (exercise.recommendations.recommended.some(area => painAreas.includes(area) || area === level)) {
      status = 'recommended'
    }

    return { ...exercise, status }
  })
}

