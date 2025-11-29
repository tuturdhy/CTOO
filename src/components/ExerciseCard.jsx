import './ExerciseCard.css'

function ExerciseCard({ exercise, onSelect, disabled = false }) {
  const handleModeSelect = (mode) => {
    if (!disabled && onSelect) {
      onSelect(exercise.id, mode)
    }
  }

  return (
    <div className={`exercise-card card ${disabled ? 'disabled' : ''}`}>
      <div className="exercise-card-header">
        <h3>{exercise.name}</h3>
        <span className={`badge badge-${exercise.status === 'recommended' ? 'success' : exercise.status === 'modified' ? 'warning' : 'error'}`}>
          {exercise.difficulty}
        </span>
      </div>
      
      <p className="exercise-card-description">{exercise.description}</p>
      
      <div className="exercise-card-meta">
        <span>⏱️ {typeof exercise.duration === 'number' ? `${exercise.duration} ${exercise.duration > 20 ? 'sec' : 'rép'}` : exercise.duration}</span>
        <span>📊 {exercise.category}</span>
      </div>

      {!disabled && (
        <div className="exercise-card-actions">
          <button
            className="btn btn-secondary"
            onClick={() => handleModeSelect('no-cam')}
          >
            Apprendre sans caméra
          </button>
          <button
            className="btn btn-primary"
            onClick={() => handleModeSelect('cam')}
          >
            Analyser avec caméra
          </button>
        </div>
      )}

      {disabled && (
        <div className="exercise-card-disabled">
          <p>Cet exercice n'est pas recommandé pour votre profil.</p>
        </div>
      )}
    </div>
  )
}

export default ExerciseCard

