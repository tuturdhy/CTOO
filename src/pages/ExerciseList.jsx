import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { filterExercisesByProfile } from '../data/exercises'
import { storage, STORAGE_KEYS } from '../utils/storage'
import ExerciseCard from '../components/ExerciseCard'
import Orb from './Orb' // ou '../components/Orb' si vous mettez Orb dans components
import './ExerciseList.css'

function ExerciseList() {
  const navigate = useNavigate()
  const [exercises, setExercises] = useState([])

  useEffect(() => {
    const survey = storage.get(STORAGE_KEYS.USER_SURVEY)
    const filtered = filterExercisesByProfile(survey)
    setExercises(filtered)
  }, [])

  const exercisesByStatus = {
    recommended: exercises.filter(ex => ex.status === 'recommended'),
    modified: exercises.filter(ex => ex.status === 'modified'),
    avoid: exercises.filter(ex => ex.status === 'avoid')
  }

  return (
    <div className="exercise-list-page">
      {/* Background Orb */}
      <div className="exercise-background">
        <Orb
          hue={-30}
          hoverIntensity={0.3}
          rotateOnHover={false}
          forceHoverState={false}
        />
      </div>

      <div className="container">
        <div className="exercise-list-header">
          <div className="header-top">
            <h1>Exercices personnalisés</h1>
            <button 
              className="btn btn-secondary"
              onClick={() => navigate('/profile')}
            >
              Mon Profil
            </button>
          </div>
          <p>Basés sur votre profil de santé</p>
        </div>

        {exercisesByStatus.recommended.length > 0 && (
          <section className="exercise-section">
            <h2 className="section-title">
              <span className="section-icon">✅</span>
              Recommandés
            </h2>
            <div className="exercise-grid">
              {exercisesByStatus.recommended.map(exercise => (
                <ExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  onSelect={(id, mode) => navigate(`/exercise/${id}/${mode}`)}
                />
              ))}
            </div>
          </section>
        )}

        {exercisesByStatus.modified.length > 0 && (
          <section className="exercise-section">
            <h2 className="section-title">
              <span className="section-icon">⚠️</span>
              À faire avec modifications
            </h2>
            <div className="exercise-grid">
              {exercisesByStatus.modified.map(exercise => (
                <ExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  onSelect={(id, mode) => navigate(`/exercise/${id}/${mode}`)}
                />
              ))}
            </div>
          </section>
        )}

        {exercisesByStatus.avoid.length > 0 && (
          <section className="exercise-section">
            <h2 className="section-title">
              <span className="section-icon">❌</span>
              À éviter
            </h2>
            <div className="exercise-grid">
              {exercisesByStatus.avoid.map(exercise => (
                <ExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  onSelect={(id, mode) => navigate(`/exercise/${id}/${mode}`)}
                  disabled={true}
                />
              ))}
            </div>
          </section>
        )}

        <div className="legal-notice">
          <p>
            ⚠️ <strong>Mention légale :</strong> Ces conseils sont généraux. 
            Consultez un professionnel de santé avant tout programme de rééducation.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ExerciseList