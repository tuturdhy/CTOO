import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import * as tf from '@tensorflow/tfjs'
import * as poseDetection from '@tensorflow-models/pose-detection'
import { EXERCISES } from '../data/exercises'
import { storage, STORAGE_KEYS } from '../utils/storage'
import './ExercisePlayerCam.css'

function ExercisePlayerCam() {
  const { id } = useParams()
  const navigate = useNavigate()
  const exercise = EXERCISES.find(ex => ex.id === id)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [detector, setDetector] = useState(null)
  const [angles, setAngles] = useState({})
  const [errors, setErrors] = useState([])
  const [score, setScore] = useState(100)
  const [isInitialized, setIsInitialized] = useState(false)
  const [hasPermission, setHasPermission] = useState(null)
  const [detectionStatus, setDetectionStatus] = useState('En attente...')
  const animationFrameRef = useRef(null)
  const smoothedKeypointsRef = useRef(null)

  useEffect(() => {
    if (!exercise) {
      navigate('/exercises')
      return
    }
    initializeDetector()
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (videoRef.current) {
        const stream = videoRef.current.srcObject
        if (stream) {
          stream.getTracks().forEach(track => track.stop())
        }
      }
    }
  }, [exercise, navigate])

  const initializeDetector = async () => {
    try {
      await tf.ready()
      const model = poseDetection.SupportedModels.MoveNet
      const detectorConfig = {
        modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING
      }
      const poseDetector = await poseDetection.createDetector(model, detectorConfig)
      setDetector(poseDetector)
      setIsInitialized(true)
    } catch (error) {
      console.error('Error initializing detector:', error)
      alert('Erreur lors de l\'initialisation du détecteur de pose')
    }
  }

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user' 
        }
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
        
        // Attendre que la vidéo soit prête avant d'afficher
        videoRef.current.addEventListener('loadedmetadata', () => {
          if (canvasRef.current) {
            canvasRef.current.width = videoRef.current.videoWidth
            canvasRef.current.height = videoRef.current.videoHeight
          }
        })
        
        setHasPermission(true)
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
      setHasPermission(false)
      alert('Impossible d\'accéder à la caméra. Veuillez autoriser l\'accès dans les paramètres de votre navigateur.')
    }
  }

  const calculateAngle = (point1, point2, point3) => {
    if (!point1 || !point2 || !point3) return null

    const vector1 = {
      x: point1.x - point2.x,
      y: point1.y - point2.y
    }
    const vector2 = {
      x: point3.x - point2.x,
      y: point3.y - point2.y
    }

    const dot = vector1.x * vector2.x + vector1.y * vector2.y
    const mag1 = Math.sqrt(vector1.x * vector1.x + vector1.y * vector1.y)
    const mag2 = Math.sqrt(vector2.x * vector2.x + vector2.y * vector2.y)

    if (mag1 === 0 || mag2 === 0) return null

    const cosAngle = dot / (mag1 * mag2)
    const angle = Math.acos(Math.max(-1, Math.min(1, cosAngle))) * (180 / Math.PI)
    return angle
  }

  const smoothKeypoints = (newKeypoints, alpha = 0.6) => {
    if (!smoothedKeypointsRef.current) {
      smoothedKeypointsRef.current = newKeypoints
      return newKeypoints
    }

    return newKeypoints.map((kp, i) => {
      const prev = smoothedKeypointsRef.current[i]
      if (!prev) return kp
      return {
        ...kp,
        x: alpha * kp.x + (1 - alpha) * prev.x,
        y: alpha * kp.y + (1 - alpha) * prev.y
      }
    })
  }

  const analyzePose = async () => {
    if (!detector || !videoRef.current || !canvasRef.current || !isAnalyzing) {
      return
    }

    const video = videoRef.current
    const canvas = canvasRef.current
    
    // Vérifier que la vidéo est prête (HAVE_ENOUGH_DATA = 4)
    if (!video || video.readyState < 4) {
      animationFrameRef.current = requestAnimationFrame(analyzePose)
      return
    }

    const ctx = canvas.getContext('2d')

    // Synchroniser les dimensions du canvas avec la vidéo
    const videoWidth = video.videoWidth || video.clientWidth
    const videoHeight = video.videoHeight || video.clientHeight
    
    if (canvas.width !== videoWidth || canvas.height !== videoHeight) {
      canvas.width = videoWidth
      canvas.height = videoHeight
      // Ajuster le style pour correspondre à la vidéo
      canvas.style.width = '100%'
      canvas.style.height = '100%'
    }

    try {
      const poses = await detector.estimatePoses(video)
      
      // Effacer le canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (poses.length > 0) {
        const pose = poses[0]
        const keypoints = pose.keypoints
        const smoothed = smoothKeypoints(keypoints)
        smoothedKeypointsRef.current = smoothed

        // MoveNet peut utiliser des noms ou des indices
        // Créer un objet avec les keypoints nommés pour faciliter l'accès
        const namedKeypoints = {}
        
        // Si les keypoints ont déjà un nom, les utiliser directement
        // Sinon, utiliser le mapping par index
        const keypointMap = [
          'nose', 'left_eye', 'right_eye', 'left_ear', 'right_ear',
          'left_shoulder', 'right_shoulder', 'left_elbow', 'right_elbow',
          'left_wrist', 'right_wrist', 'left_hip', 'right_hip',
          'left_knee', 'right_knee', 'left_ankle', 'right_ankle'
        ]

        smoothed.forEach((kp, index) => {
          // Vérifier si le keypoint a déjà un nom
          const name = kp.name || keypointMap[index] || `keypoint_${index}`
          namedKeypoints[name] = { ...kp, name }
        })

        // Dessiner les connexions principales (squelette)
        ctx.strokeStyle = '#D6001C'
        ctx.lineWidth = 3
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'

        // Définir les connexions du squelette
        const skeletonConnections = [
          // Tête
          ['left_eye', 'right_eye'],
          ['left_eye', 'left_ear'],
          ['right_eye', 'right_ear'],
          // Tronc
          ['left_shoulder', 'right_shoulder'],
          ['left_shoulder', 'left_hip'],
          ['right_shoulder', 'right_hip'],
          ['left_hip', 'right_hip'],
          // Bras gauche
          ['left_shoulder', 'left_elbow'],
          ['left_elbow', 'left_wrist'],
          // Bras droit
          ['right_shoulder', 'right_elbow'],
          ['right_elbow', 'right_wrist'],
          // Jambe gauche
          ['left_hip', 'left_knee'],
          ['left_knee', 'left_ankle'],
          // Jambe droite
          ['right_hip', 'right_knee'],
          ['right_knee', 'right_ankle']
        ]

        // Dessiner les lignes du squelette
        skeletonConnections.forEach(([point1Name, point2Name]) => {
          const point1 = namedKeypoints[point1Name]
          const point2 = namedKeypoints[point2Name]
          
          if (point1 && point2 && point1.score > 0.3 && point2.score > 0.3) {
            ctx.beginPath()
            ctx.moveTo(point1.x, point1.y)
            ctx.lineTo(point2.x, point2.y)
            ctx.stroke()
          }
        })

        // Dessiner les keypoints (points clés)
        smoothed.forEach((kp, index) => {
          if (kp.score > 0.3) {
            // Cercle extérieur
            ctx.fillStyle = 'rgba(214, 0, 28, 0.3)'
            ctx.beginPath()
            ctx.arc(kp.x, kp.y, 10, 0, 2 * Math.PI)
            ctx.fill()
            
            // Point central
            ctx.fillStyle = '#D6001C'
            ctx.beginPath()
            ctx.arc(kp.x, kp.y, 5, 0, 2 * Math.PI)
            ctx.fill()
          }
        })

        // Calculer les angles selon l'exercice
        const newAngles = {}
        const newErrors = []
        let errorCount = 0

        // Utiliser les keypoints nommés pour les calculs
        if (exercise.id === 'squat-modified') {
          // Angle genou (hanche-genou-cheville)
          const leftHip = namedKeypoints['left_hip']
          const leftKnee = namedKeypoints['left_knee']
          const leftAnkle = namedKeypoints['left_ankle']
          
          const rightHip = namedKeypoints['right_hip']
          const rightKnee = namedKeypoints['right_knee']
          const rightAnkle = namedKeypoints['right_ankle']

          // Utiliser le côté le plus visible
          let hip, knee, ankle
          if (leftHip && leftKnee && leftAnkle && 
              leftHip.score > 0.3 && leftKnee.score > 0.3 && leftAnkle.score > 0.3) {
            hip = leftHip
            knee = leftKnee
            ankle = leftAnkle
          } else if (rightHip && rightKnee && rightAnkle &&
                     rightHip.score > 0.3 && rightKnee.score > 0.3 && rightAnkle.score > 0.3) {
            hip = rightHip
            knee = rightKnee
            ankle = rightAnkle
          }

          if (hip && knee && ankle) {
            const kneeAngle = calculateAngle(hip, knee, ankle)
            if (kneeAngle !== null) {
              newAngles.knee = Math.round(kneeAngle)
              if (exercise.angles && exercise.angles.knee && 
                  (kneeAngle < exercise.angles.knee.min || kneeAngle > exercise.angles.knee.max)) {
                newErrors.push({ id: 'knees-in', message: 'Vos genoux s\'effondrent vers l\'intérieur' })
                errorCount++
              }
            }
          }
        }

        setAngles(newAngles)
        setErrors(newErrors)
        setScore(Math.max(0, 100 - (errorCount * 20)))
        setDetectionStatus('✅ Pose détectée')
      } else {
        // Aucune pose détectée
        setDetectionStatus('⚠️ Aucune pose détectée - Positionnez-vous face à la caméra')
        
        // Afficher un message visuel sur le canvas
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = '#FFFFFF'
        ctx.font = 'bold 20px Inter'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('Positionnez-vous face à la caméra', canvas.width / 2, canvas.height / 2)
      }
    } catch (error) {
      console.error('Error analyzing pose:', error)
    }

    // Continuer la boucle d'analyse
    if (isAnalyzing) {
      animationFrameRef.current = requestAnimationFrame(analyzePose)
    }
  }

  const startAnalysis = () => {
    if (!hasPermission) {
      requestCameraPermission()
      return
    }
    if (!detector) {
      alert('Le détecteur de pose n\'est pas encore initialisé. Veuillez patienter...')
      return
    }
    const video = videoRef.current
    if (!video || video.readyState !== 4) { // HAVE_ENOUGH_DATA = 4
      alert('La vidéo n\'est pas encore prête. Veuillez patienter quelques secondes...')
      return
    }
    setIsAnalyzing(true)
    analyzePose()
  }

  const stopAnalysis = () => {
    setIsAnalyzing(false)
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
  }

  const finishExercise = () => {
    stopAnalysis()
    
    // Sauvegarder la session
    const session = {
      id: Date.now(),
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      mode: 'cam',
      score: score,
      angles: angles,
      errors: errors,
      completedAt: new Date().toISOString()
    }
    
    const history = storage.get(STORAGE_KEYS.SESSION_HISTORY) || []
    history.push(session)
    storage.set(STORAGE_KEYS.SESSION_HISTORY, history)

    // Afficher le résultat
    setTimeout(() => {
      alert(`🎉 Exercice terminé !\n\nScore : ${score}%\nErreurs détectées : ${errors.length}`)
      navigate('/exercises')
    }, 500)
  }

  if (!exercise) return null

  return (
    <div className="exercise-cam-page">
      <div className="container">
        <div className="exercise-cam-header">
          <button className="btn-back" onClick={() => navigate('/exercises')}>
            ← Retour
          </button>
          <h1>{exercise.name}</h1>
          <p className="privacy-notice">
            🔒 Aucune image n'est envoyée au serveur — tout est traité localement sur votre appareil.
          </p>
        </div>

        <div className="exercise-cam-content">
          {!hasPermission && (
            <div className="camera-permission">
              <p>Pour utiliser l'analyse en temps réel, nous avons besoin d'accéder à votre caméra.</p>
              <button className="btn btn-primary btn-large" onClick={requestCameraPermission}>
                Autoriser la caméra
              </button>
            </div>
          )}

          {hasPermission && (
            <>
              <div className="camera-container">
                <div className="video-wrapper">
                  <video
                    ref={videoRef}
                    className="camera-video"
                    playsInline
                    muted
                    autoPlay
                  />
                  <canvas ref={canvasRef} className="camera-canvas" />
                </div>
              </div>

              <div className="analysis-panel">
                <div className="status-display">
                  <h3>Statut de détection</h3>
                  <p className="detection-status">{detectionStatus}</p>
                </div>
                
                <div className="angles-display">
                  <h3>Angles détectés</h3>
                  {Object.keys(angles).length === 0 ? (
                    <p className="no-data">En attente de détection...</p>
                  ) : (
                    Object.entries(angles).map(([key, value]) => (
                      <div key={key} className="angle-item">
                        <span className="angle-label">{key}:</span>
                        <span className="angle-value">{value}°</span>
                      </div>
                    ))
                  )}
                </div>

                <div className="errors-display">
                  <h3>Corrections</h3>
                  {errors.length === 0 ? (
                    <p className="no-errors">✅ Posture correcte !</p>
                  ) : (
                    errors.map((error, index) => (
                      <div key={index} className="error-alert">
                        ⚠️ {error.message}
                      </div>
                    ))
                  )}
                </div>

                <div className="score-display">
                  <h3>Score</h3>
                  <div className="score-value">{score}%</div>
                </div>
              </div>

              <div className="exercise-cam-actions">
                {!isAnalyzing ? (
                  <button
                    className="btn btn-primary btn-large"
                    onClick={startAnalysis}
                    disabled={!isInitialized}
                  >
                    {!isInitialized ? 'Initialisation...' : 'Démarrer l\'analyse'}
                  </button>
                ) : (
                  <>
                    <button className="btn btn-secondary btn-large" onClick={stopAnalysis}>
                      Arrêter
                    </button>
                    <button className="btn btn-primary btn-large" onClick={finishExercise}>
                      Terminer
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ExercisePlayerCam

