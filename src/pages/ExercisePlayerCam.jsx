// src/pages/ExercisePlayerCam.jsx
import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import * as tf from '@tensorflow/tfjs'
import * as poseDetection from '@tensorflow-models/pose-detection'
import { EXERCISES } from '../data/exercises'
import { storage, STORAGE_KEYS } from '../utils/storage'
import './ExercisePlayerCam.css'
import Orb from './Orb';

function ExercisePlayerCam() {
  const { id } = useParams()
  const navigate = useNavigate()
  const exercise = EXERCISES.find(ex => ex.id === id)

  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const animationFrameRef = useRef(null)
  const smoothedKeypointsRef = useRef(null)

  const [detector, setDetector] = useState(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [hasPermission, setHasPermission] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // UI state shown to the user
  const [detectionStatus, setDetectionStatus] = useState('En attente...')
  const [angles, setAngles] = useState({})
  const [errors, setErrors] = useState([])
  const [score, setScore] = useState(100)

  useEffect(() => {
    if (!exercise) {
      navigate('/exercises')
      return
    }
    initializeDetector()

    return () => {
      // cleanup
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject
        try { stream.getTracks().forEach(t => t.stop()) } catch (e) { /* ignore */ }
        videoRef.current.srcObject = null
      }
      if (detector && detector.dispose) {
        try { detector.dispose() } catch (e) { /* ignore */ }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercise, navigate])

  // Initialize MoveNet detector
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
      setDetectionStatus('✅ Modèle prêt')
    } catch (error) {
      console.error('Error initializing detector:', error)
      setDetectionStatus('❌ Erreur d\'initialisation du modèle')
      alert('Erreur lors de l\'initialisation du détecteur de pose')
    }
  }

  // Request camera permission and start video
  const requestCameraPermission = async () => {
    try {
      setDetectionStatus('⏳ Demande d\'accès à la caméra...')
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        },
        audio: false
      })
      if (videoRef.current) {
        // attach stream and try to play
        videoRef.current.srcObject = stream
        videoRef.current.muted = true
        videoRef.current.playsInline = true
        // ensure video is visible
        videoRef.current.style.display = 'block'
        try {
          await videoRef.current.play()
        } catch (playErr) {
          // autoplay policy — still continue; user will press start
          console.warn('video.play() failed (autoplay policy):', playErr)
        }
        // set canvas size when metadata available
        const onLoaded = () => {
          const v = videoRef.current
          const c = canvasRef.current
          if (c && v) {
            c.width = v.videoWidth || v.clientWidth || 640
            c.height = v.videoHeight || v.clientHeight || 480
            // make sure canvas overlays video (CSS should handle it)
          }
        }
        videoRef.current.addEventListener('loadedmetadata', onLoaded, { once: true })
        videoRef.current.addEventListener('loadeddata', onLoaded, { once: true })
      }
      setHasPermission(true)
      setDetectionStatus('✅ Caméra autorisée')
    } catch (error) {
      console.error('Error accessing camera:', error)
      setHasPermission(false)
      setDetectionStatus('⛔ Accès caméra refusé')
      alert('Impossible d\'accéder à la caméra. Veuillez autoriser l\'accès dans les paramètres de votre navigateur et fermer les autres apps utilisant la caméra.')
    }
  }

  // utility: calculate angle between three points (p1 - p2 - p3) in degrees
  const calculateAngle = (p1, p2, p3) => {
    if (!p1 || !p2 || !p3) return null
    const v1 = { x: p1.x - p2.x, y: p1.y - p2.y }
    const v2 = { x: p3.x - p2.x, y: p3.y - p2.y }
    const dot = v1.x * v2.x + v1.y * v2.y
    const m1 = Math.hypot(v1.x, v1.y)
    const m2 = Math.hypot(v2.x, v2.y)
    if (m1 === 0 || m2 === 0) return null
    const cos = Math.max(-1, Math.min(1, dot / (m1 * m2)))
    return Math.acos(cos) * (180 / Math.PI)
  }

  // smoothing optional
  const smoothKeypoints = (newKeypoints, alpha = 0.6) => {
    if (!smoothedKeypointsRef.current) {
      smoothedKeypointsRef.current = newKeypoints
      return newKeypoints
    }
    const prev = smoothedKeypointsRef.current
    const out = newKeypoints.map((kp, i) => {
      const p = prev[i]
      if (!p) return kp
      return {
        ...kp,
        x: alpha * kp.x + (1 - alpha) * p.x,
        y: alpha * kp.y + (1 - alpha) * p.y
      }
    })
    smoothedKeypointsRef.current = out
    return out
  }

  // Map keypoints -> named object and ensure coordinates are pixels
  function getNamedKeypoints(keypoints) {
    const keypointMap = [
      'nose','left_eye','right_eye','left_ear','right_ear',
      'left_shoulder','right_shoulder','left_elbow','right_elbow',
      'left_wrist','right_wrist','left_hip','right_hip',
      'left_knee','right_knee','left_ankle','right_ankle'
    ]
    const named = {}
    const c = canvasRef.current
    keypoints.forEach((kp, idx) => {
      const name = kp.name || keypointMap[idx] || `kp_${idx}`
      let x = kp.x; let y = kp.y
      if (typeof x === 'number' && typeof y === 'number') {
        // if normalized (<=1) convert to pixels
        if (x <= 1 && y <= 1 && c) {
          x = x * c.width
          y = y * c.height
        }
      }
      named[name] = { ...kp, x, y, name }
    })
    return named
  }

  // Draw skeleton and keypoints on canvas
  function drawPose(ctx, namedKeypoints) {
    if (!ctx) return
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    const connections = [
      ['left_eye','right_eye'],['left_eye','left_ear'],['right_eye','right_ear'],
      ['left_shoulder','right_shoulder'],['left_shoulder','left_hip'],['right_shoulder','right_hip'],
      ['left_hip','right_hip'],['left_shoulder','left_elbow'],['left_elbow','left_wrist'],
      ['right_shoulder','right_elbow'],['right_elbow','right_wrist'],
      ['left_hip','left_knee'],['left_knee','left_ankle'],
      ['right_hip','right_knee'],['right_knee','right_ankle']
    ]
    const DRAW_THRESHOLD = 0.15

    ctx.lineWidth = 3
    ctx.strokeStyle = '#D6001C'
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    connections.forEach(([a,b]) => {
      const p1 = namedKeypoints[a]; const p2 = namedKeypoints[b]
      if (!p1 || !p2) return
      if ((p1.score || 0) > DRAW_THRESHOLD && (p2.score || 0) > DRAW_THRESHOLD) {
        ctx.beginPath()
        ctx.moveTo(p1.x, p1.y)
        ctx.lineTo(p2.x, p2.y)
        ctx.stroke()
      }
    })

    Object.values(namedKeypoints).forEach(kp => {
      if (!kp) return
      if ((kp.score || 0) > DRAW_THRESHOLD) {
        ctx.fillStyle = 'rgba(214,0,28,0.28)'
        ctx.beginPath()
        ctx.arc(kp.x, kp.y, 8, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = '#D6001C'
        ctx.beginPath()
        ctx.arc(kp.x, kp.y, 4, 0, Math.PI * 2)
        ctx.fill()
      }
    })
  }

  // Core loop: estimate poses and update UI
  const analyzePose = async () => {
    if (!detector || !videoRef.current || !canvasRef.current) return
    if (!isAnalyzing) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    // wait until video has enough data
    if (video.readyState < 2) { // HAVE_CURRENT_DATA
      animationFrameRef.current = requestAnimationFrame(analyzePose)
      return
    }

    // ensure canvas size matches video
    if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
      canvas.width = video.videoWidth || canvas.clientWidth
      canvas.height = video.videoHeight || canvas.clientHeight
    }

    try {
      // estimate poses
      const poses = await detector.estimatePoses(video, { maxPoses: 1, flipHorizontal: false })
      if (!poses || poses.length === 0) {
        setDetectionStatus('⚠️ Aucune pose détectée — placez-vous face à la caméra')
        setAngles({})
        setErrors([])
        animationFrameRef.current = requestAnimationFrame(analyzePose)
        return
      }

      const pose = poses[0]
      let keypoints = pose.keypoints || []
      keypoints = smoothKeypoints(keypoints, 0.6)
      const named = getNamedKeypoints(keypoints)

      // draw skeleton for user feedback
      drawPose(ctx, named)

      // compute angles & errors for the exercise
      const newAngles = {}
      const newErrors = []
      let errorCount = 0

      if (exercise && exercise.id === 'squat-modified') {
        const leftHip = named.left_hip, leftKnee = named.left_knee, leftAnkle = named.left_ankle
        const rightHip = named.right_hip, rightKnee = named.right_knee, rightAnkle = named.right_ankle

        const leftOk = leftHip && leftKnee && leftAnkle && leftHip.score > 0.25 && leftKnee.score > 0.25 && leftAnkle.score > 0.25
        const rightOk = rightHip && rightKnee && rightAnkle && rightHip.score > 0.25 && rightKnee.score > 0.25 && rightAnkle.score > 0.25

        if (leftOk || rightOk) {
          const hip = leftOk ? leftHip : rightHip
          const knee = leftOk ? leftKnee : rightKnee
          const ankle = leftOk ? leftAnkle : rightAnkle
          const kneeAngle = calculateAngle(hip, knee, ankle)
          if (kneeAngle !== null) {
            newAngles.knee = Math.round(kneeAngle)
            if (exercise.angles && exercise.angles.knee) {
              const min = exercise.angles.knee.min
              const max = exercise.angles.knee.max
              if (kneeAngle < min || kneeAngle > max) {
                newErrors.push({ id: 'knees-in', message: "Vos genoux s'effondrent ou profondeur non correcte." })
                errorCount++
              }
            }
          }
        } else {
          newErrors.push({ id: 'low-confidence', message: "Position pas assez visible — rapprochez-vous ou améliorez l'éclairage." })
        }
      }

      // update UI
      setAngles(newAngles)
      setErrors(newErrors)
      setScore(Math.max(0, 100 - errorCount * 20))
      setDetectionStatus('✅ Pose détectée')

    } catch (err) {
      console.error('Error analyzing pose:', err)
      setDetectionStatus('❌ Erreur d\'analyse')
    }

    // schedule next frame
    animationFrameRef.current = requestAnimationFrame(analyzePose)
  }

  // Start analysis (called by button)
  const startAnalysis = async () => {
    if (!hasPermission) {
      await requestCameraPermission()
    }
    if (!detector) {
      alert("Le détecteur n'est pas encore prêt — veuillez patienter.")
      return
    }
    // ensure video ready
    const video = videoRef.current
    if (!video) {
      alert('Vidéo introuvable')
      return
    }
    setIsAnalyzing(true)
    setDetectionStatus('🔎 Analyse en cours...')
    // small delay to allow video pipeline
    setTimeout(() => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = requestAnimationFrame(analyzePose)
    }, 120)
  }

  const stopAnalysis = () => {
    setIsAnalyzing(false)
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
    setDetectionStatus('⏸️ Analyse arrêtée')
  }

  const finishExercise = () => {
    stopAnalysis()
    const session = {
      id: Date.now(),
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      mode: 'cam',
      score,
      angles,
      errors,
      completedAt: new Date().toISOString()
    }
    const history = storage.get(STORAGE_KEYS.SESSION_HISTORY) || []
    history.push(session)
    storage.set(STORAGE_KEYS.SESSION_HISTORY, history)
    setTimeout(() => {
      alert(`🎉 Exercice terminé ! Score : ${score}% — Erreurs : ${errors.length}`)
      navigate('/exercises')
    }, 300)
  }

  if (!exercise) return null

  return (
    <div className="exercise-player-page exercise-player-bleu-theme">
    {/* 👇 FOND ORB EN ARRIÈRE-PLAN */}
    <div className="exercise-player-background">
      <Orb
        hue={-30}
        hoverIntensity={0.3}
        rotateOnHover={false}
        forceHoverState={false}
      />
    </div>
      <div className="container">
        <div className="exercise-cam-header">
          <button className="btn-back" onClick={() => navigate('/exercises')}>← Retour</button>
          <h1>{exercise.name}</h1>
          <p className="privacy-notice">🔒 Aucune image n'est envoyée au serveur — tout est traité localement sur votre appareil.</p>
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
                <div className="video-wrapper" style={{ position: 'relative' }}>
                  <video ref={videoRef} className="camera-video" playsInline muted autoPlay style={{ width: '100%', height: 'auto', display: 'block', background: '#000' }} />
                  <canvas ref={canvasRef} className="camera-canvas" style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }} />
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
                    Object.entries(angles).map(([k, v]) => (
                      <div key={k} className="angle-item">
                        <span className="angle-label">{k}:</span>
                        <span className="angle-value">{v}°</span>
                      </div>
                    ))
                  )}
                </div>

                <div className="errors-display">
                  <h3>Corrections</h3>
                  {errors.length === 0 ? (
                    <p className="no-errors">✅ Posture correcte !</p>
                  ) : (
                    errors.map((err, i) => (
                      <div key={i} className="error-alert">⚠️ {err.message}</div>
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
                  <button className="btn btn-primary btn-large" onClick={startAnalysis} disabled={!isInitialized}>
                    {!isInitialized ? 'Initialisation...' : 'Démarrer l\'analyse'}
                  </button>
                ) : (
                  <>
                    <button className="btn btn-secondary btn-large" onClick={stopAnalysis}>Arrêter</button>
                    <button className="btn btn-primary btn-large" onClick={finishExercise}>Terminer</button>
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
