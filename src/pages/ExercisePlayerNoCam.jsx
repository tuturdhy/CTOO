import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { EXERCISES } from '../data/exercises'
import { storage, STORAGE_KEYS } from '../utils/storage'
import ExerciseSVG from '../components/ExerciseSVG'
import './ExercisePlayerNoCam.css'

function ExercisePlayerNoCam() {
  const { id } = useParams()
  const navigate = useNavigate()
  const exercise = EXERCISES.find(ex => ex.id === id)
  const [phase, setPhase] = useState('start')
  const [isRunning, setIsRunning] = useState(false)
  const [currentRep, setCurrentRep] = useState(0)
  const [currentTip, setCurrentTip] = useState(0)
  const [countdown, setCountdown] = useState(null)
  const intervalRef = useRef(null)
  const tipIntervalRef = useRef(null)

  useEffect(() => {
    if (!exercise) {
      navigate('/exercises')
      return
    }
  }, [exercise, navigate])

  useEffect(() => {
    if (isRunning && countdown === null) {
      // Cycle des répétitions
      const totalReps = exercise.duration
      let repCount = 0
      let currentPhaseIndex = 0
      const phases = exercise.svgPhases

      intervalRef.current = setInterval(() => {
        if (repCount < totalReps) {
          // Changer de phase dans le cycle
          currentPhaseIndex = (currentPhaseIndex + 1) % phases.length
          setPhase(phases[currentPhaseIndex])
          
          if (currentPhaseIndex === 0) {
            // Nouvelle répétition
            repCount++
            setCurrentRep(repCount)
          }
        } else {
          // Fin de l'exercice
          finishExercise()
        }
      }, 1500) // 1.5s par phase

      // Changer les conseils périodiquement
      tipIntervalRef.current = setInterval(() => {
        setCurrentTip(prev => (prev + 1) % exercise.tips.length)
      }, 3000)
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (tipIntervalRef.current) clearInterval(tipIntervalRef.current)
    }
  }, [isRunning, countdown, exercise])

  const startExercise = () => {
    // Compte à rebours
    setCountdown(3)
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval)
          setIsRunning(true)
          setCurrentRep(0)
          setPhase(exercise.svgPhases[0])
          return null
        }
        return prev - 1
      })
    }, 1000)
  }

  const finishExercise = () => {
    setIsRunning(false)
    setPhase('start')
    setCurrentRep(0)
    setCurrentTip(0)
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (tipIntervalRef.current) clearInterval(tipIntervalRef.current)

    // Sauvegarder la session
    const session = {
      id: Date.now(),
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      mode: 'no-cam',
      score: 'good', // Basé sur le profil
      completedAt: new Date().toISOString()
    }
    
    const history = storage.get(STORAGE_KEYS.SESSION_HISTORY) || []
    history.push(session)
    storage.set(STORAGE_KEYS.SESSION_HISTORY, history)

    // Afficher le résultat
    setTimeout(() => {
      alert(`🎉 Exercice terminé !\n\nRépétitions complétées : ${exercise.duration}\nPerformance : Bonne`)
      navigate('/exercises')
    }, 500)
  }

  const stopExercise = () => {
    setIsRunning(false)
    setCountdown(null)
    setCurrentRep(0)
    setPhase('start')
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (tipIntervalRef.current) clearInterval(tipIntervalRef.current)
  }

  if (!exercise) return null

  const progress = isRunning ? (currentRep / exercise.duration) * 100 : 0

  return (
    <div className="exercise-player-page">
      <div className="container">
        <div className="exercise-player-header">
          <button className="btn-back" onClick={() => navigate('/exercises')}>
            ← Retour
          </button>
          <h1>{exercise.name}</h1>
          <p>Durée estimée : {exercise.duration} {typeof exercise.duration === 'number' && exercise.duration > 20 ? 'secondes' : 'répétitions'}</p>
        </div>

        <div className="exercise-player-content">
          <div className="exercise-animation-container">
            <div className={`exercise-svg-wrapper ${phase}`}>
              <ExerciseSVG exerciseId={exercise.id} phase={phase} />
            </div>
          </div>

          {countdown !== null && (
            <div className="countdown-overlay">
              <div className="countdown-number">{countdown}</div>
            </div>
          )}

          {isRunning && (
            <div className="exercise-progress">
              <div className="progress-bar">
                <div 
                  className="progress-bar-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="progress-info">
                <span>Répétition {currentRep} / {exercise.duration}</span>
              </div>
            </div>
          )}

          <div className="exercise-tips">
            <h3>💡 Conseil</h3>
            <p className="tip-text fade-in">{exercise.tips[currentTip]}</p>
          </div>

          <div className="exercise-actions">
            {!isRunning && countdown === null && (
              <button className="btn btn-primary btn-large" onClick={startExercise}>
                Démarrer
              </button>
            )}
            {isRunning && (
              <button className="btn btn-secondary btn-large" onClick={stopExercise}>
                Arrêter
              </button>
            )}
          </div>

          <div className="exercise-common-errors">
            <h3>⚠️ Erreurs fréquentes</h3>
            <div className="errors-list">
              {exercise.commonErrors.map((error, index) => (
                <div key={index} className="error-item">
                  <strong>{error.name}:</strong> {error.description}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExercisePlayerNoCam

