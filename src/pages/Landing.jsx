import { useNavigate } from 'react-router-dom'
import './Landing.css'
import AthleteIcon from '../components/icons/AthleteIcon'
import Iridescence from './Iridescence'
import CircularGallery from './CircularGallery'

function Landing() {
  const navigate = useNavigate()
  
  const galleryItems = [
    { 
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
      text: '🎯 Guidage intelligent'
    },
    { 
      image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop',
      text: '🔒 100% privé'
    },
    { 
      image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=600&fit=crop',
      text: '⚡ Personnalisé'
    }
  ]

  return (
    <div className="landing">
      <div className="landing-background">
      <Iridescence
  color={[0.8, 0.2, 0.2]}  // Rouge foncé au lieu de violet
  mouseReact={true}
  amplitude={0.05}
  speed={0.6}
/>
      </div>
      
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
        
        <div className="landing-gallery-container">
          <CircularGallery 
            items={galleryItems}
            bend={2}
            textColor="#ffffff"
            borderRadius={0.08}
            scrollEase={0.08}
            scrollSpeed={1.5}
          />
        </div>
      </div>
    </div>
  )
}

export default Landing