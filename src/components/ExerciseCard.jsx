// src/components/ExerciseCard.jsx
import React from 'react';
import './ExerciseCard.css'; // tu peux créer ce fichier ou intégrer le style ci-dessus

export default function ExerciseCard({ exercise, onSelect, disabled = false }) {
  return (
    <div className={`exercise-card ${disabled ? 'disabled' : ''}`}>
      <div className="exercise-card-image">
        {/* Tu peux remplacer par <ExerciseSVG name={exercise.id} /> */}
        <div style={{ fontSize: '3rem' }}>🏋️</div>
      </div>
      <div className="exercise-card-content">
        <h3>{exercise.name}</h3>
        <p>{exercise.description}</p>
        <div className="exercise-card-meta">
          <span>🎯 {exercise.difficulty}</span>
          <span>⏱️ {exercise.duration} min</span>
        </div>
        {!disabled ? (
          <div className="btn-group">
            <button
              className="btn btn-secondary"
              onClick={() => onSelect(exercise.id, 'no-cam')}
            >
              Sans caméra
            </button>
            <button
              className="btn btn-primary"
              onClick={() => onSelect(exercise.id, 'cam')}
            >
              Avec caméra
            </button>
          </div>
        ) : (
          <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#e53e3e' }}>
            ❌ À éviter selon votre profil
          </p>
        )}
      </div>
    </div>
  );
}