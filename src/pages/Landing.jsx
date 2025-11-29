import { useNavigate } from 'react-router-dom'
import './Landing.css'
import AthleteIcon from '../components/icons/AthleteIcon'

function Landing() {
  const navigate = useNavigate()

  return (
    <div className="landing">
      <div className="landing-background"></div>
      <div className="landing-content">
        <div className="landing-hero fade-in">
          <div className="landing-icon">
            <AthleteIcon />
          </div>
          <h1 className="landing-title">PosturAï</h1>
          <p className="landing-subtitle">
            Apprenez la bonne posture pour vos exercices — rapide, sûr et respectueux de votre vie privée
          </p>
          <div className="landing-buttons">
            <button 
              className="btn btn-primary btn-large"
              onClick={() => navigate('/survey')}
            >
              Commencer
            </button>
            <button 
              className="btn btn-secondary btn-large"
              onClick={() => navigate('/exercises')}
            >
              Parcourir les exercices
            </button>
            <button 
              className="btn btn-secondary btn-large"
              onClick={() => navigate('/profile')}
            >
              Mon Profil
            </button>
          </div>
        </div>
        <div className="landing-features">
          <div className="feature-card slide-in" style={{ animationDelay: '0.1s' }}>
            <div className="feature-icon">🎯</div>
            <h3>Guidage intelligent</h3>
            <p>Corrections en temps réel de votre posture</p>
          </div>
          <div className="feature-card slide-in" style={{ animationDelay: '0.2s' }}>
            <div className="feature-icon">🔒</div>
            <h3>100% privé</h3>
            <p>Traitement local, aucune image envoyée</p>
          </div>
          <div className="feature-card slide-in" style={{ animationDelay: '0.3s' }}>
            <div className="feature-icon">⚡</div>
            <h3>Personnalisé</h3>
            <p>Exercices adaptés à votre profil</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Landing

