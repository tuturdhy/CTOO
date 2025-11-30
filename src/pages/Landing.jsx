// src/pages/Landing.jsx
import { useNavigate } from 'react-router-dom';
import './Landing.css';
import AthleteIcon from '../components/icons/AthleteIcon';
import TextType from '../components/TextType';
import GridMotion from '../components/GridMotion';

function Landing() {
  const navigate = useNavigate();

  // Images pour le fond (gardées pour GridMotion)
  const gridImages = [
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=600&fit=crop'
  ];

  const gridItems = Array(28).fill(null).map((_, i) => gridImages[i % gridImages.length]);

  return (
    <div className="landing">
      {/* Fond animé avec photos */}
      <GridMotion items={gridItems} />

      <div className="landing-content">
        <div className="landing-hero fade-in">
          <div className="landing-icon">
            <AthleteIcon />
          </div>
          <h1 className="landing-title">PosturAï</h1>
          <TextType
  text="Apprenez la bonne posture pour vos exercices — rapide, sûr et respectueux de votre vie privée"
  typingSpeed={60}
  pauseDuration={3000}
  showCursor={false}
  className="landing-subtitle"
  textColors={["#0ea5e9"]} // ← bleu comme les boutons secondaires
/>
          <div className="landing-buttons">
            <button className="btn btn-primary btn-large" onClick={() => navigate('/survey')}>
              Commencer
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/exercises')}>
              Parcourir les exercices
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/profile')}>
              Mon Profil
            </button>
          </div>
        </div>
        {/* 👇 SUPPRIMÉ : <div className="landing-gallery-container">...CircularGallery...</div> */}
      </div>
    </div>
  );
}

export default Landing;