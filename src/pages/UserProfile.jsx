import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { storage, STORAGE_KEYS } from '../utils/storage'
import Badge from '../components/Badge'
import './UserProfile.css'

function UserProfile() {
  const navigate = useNavigate()
  const [history, setHistory] = useState([])
  const [badges, setBadges] = useState([])
  const [survey, setSurvey] = useState(null)

  useEffect(() => {
    loadProfileData()
  }, [])

  const loadProfileData = () => {
    const sessionHistory = storage.get(STORAGE_KEYS.SESSION_HISTORY) || []
    const userBadges = storage.get(STORAGE_KEYS.BADGES) || []
    const userSurvey = storage.get(STORAGE_KEYS.USER_SURVEY)

    setHistory(sessionHistory)
    setBadges(userBadges)
    setSurvey(userSurvey)

    // Calculer les badges automatiquement
    calculateBadges(sessionHistory, userBadges)
  }

  const calculateBadges = (sessions, existingBadges) => {
    const newBadges = []
    const badgeIds = existingBadges.map(b => b.id)

    // Badge "Premier pas"
    if (sessions.length >= 1 && !badgeIds.includes('first-step')) {
      newBadges.push({ id: 'first-step', name: 'Premier pas', description: 'Complété votre premier exercice' })
    }

    // Badge "Maître du Squat"
    const squatCount = sessions.filter(s => s.exerciseId === 'squat-modified').length
    if (squatCount >= 5 && !badgeIds.includes('squat-master')) {
      newBadges.push({ id: 'squat-master', name: 'Maître du Squat', description: 'Complété 5 séances de squat' })
    }

    // Badge "Champion de Mobilité"
    const mobilityCount = sessions.filter(s => s.exerciseId === 'shoulder-rotation').length
    if (mobilityCount >= 3 && !badgeIds.includes('mobility-champion')) {
      newBadges.push({ id: 'mobility-champion', name: 'Champion de Mobilité', description: 'Complété 3 séances de mobilité' })
    }

    // Badge "Perfectionniste"
    const perfectScores = sessions.filter(s => s.score >= 90).length
    if (perfectScores >= 10 && !badgeIds.includes('perfectionist')) {
      newBadges.push({ id: 'perfectionist', name: 'Perfectionniste', description: '10 exercices avec score ≥ 90%' })
    }

    if (newBadges.length > 0) {
      const updatedBadges = [...existingBadges, ...newBadges.map(b => ({ ...b, awardedAt: new Date().toISOString() }))]
      storage.set(STORAGE_KEYS.BADGES, updatedBadges)
      setBadges(updatedBadges)
    }
  }

  const getProgressData = () => {
    const last30Days = history.filter(s => {
      const sessionDate = new Date(s.completedAt)
      const daysAgo = (Date.now() - sessionDate.getTime()) / (1000 * 60 * 60 * 24)
      return daysAgo <= 30
    })

    return {
      total: history.length,
      last30Days: last30Days.length,
      averageScore: history.length > 0
        ? Math.round(history.reduce((sum, s) => sum + (s.score || 70), 0) / history.length)
        : 0
    }
  }

  const progress = getProgressData()

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <button className="btn-back" onClick={() => navigate('/exercises')}>
            ← Retour
          </button>
          <h1>Mon Profil</h1>
        </div>

        <div className="profile-content">
          <div className="profile-stats">
            <div className="stat-card">
              <div className="stat-value">{progress.total}</div>
              <div className="stat-label">Sessions complétées</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{progress.last30Days}</div>
              <div className="stat-label">Sessions (30 derniers jours)</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{progress.averageScore}%</div>
              <div className="stat-label">Score moyen</div>
            </div>
          </div>

          {badges.length > 0 && (
            <section className="profile-section">
              <h2>Badges obtenus</h2>
              <div className="badges-grid">
                {badges.map((badge, index) => (
                  <Badge key={index} badge={badge} />
                ))}
              </div>
            </section>
          )}

          <section className="profile-section">
            <h2>Historique des sessions</h2>
            {history.length === 0 ? (
              <div className="empty-state">
                <p>Aucune session enregistrée pour le moment.</p>
                <button className="btn btn-primary" onClick={() => navigate('/exercises')}>
                  Commencer un exercice
                </button>
              </div>
            ) : (
              <div className="sessions-list">
                {history.slice().reverse().map((session, index) => (
                  <div key={index} className="session-card slide-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="session-header">
                      <h3>{session.exerciseName}</h3>
                      <span className="session-date">
                        {new Date(session.completedAt).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <div className="session-details">
                      <span className="session-mode">
                        {session.mode === 'cam' ? '📹 Avec caméra' : '📚 Sans caméra'}
                      </span>
                      {session.score && (
                        <span className="session-score">
                          Score: {session.score}%
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {survey && (
            <section className="profile-section">
              <h2>Profil de santé</h2>
              <div className="survey-summary">
                <p><strong>Niveau:</strong> {survey.fitnessLevel || 'Non spécifié'}</p>
                <p><strong>Objectif:</strong> {survey.goal || 'Non spécifié'}</p>
                {survey.hasPain && survey.painAreas.length > 0 && (
                  <p><strong>Zones de douleur:</strong> {survey.painAreas.join(', ')}</p>
                )}
                <button 
                  className="btn btn-secondary"
                  onClick={() => navigate('/survey')}
                >
                  Modifier le profil
                </button>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserProfile

