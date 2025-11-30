import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { filterExercisesByProfile } from '../data/exercises';
import { storage, STORAGE_KEYS } from '../utils/storage';
import ExerciseCard from '../components/ExerciseCard';
import Orb from './Orb';
import TextType from '../components/TextType'; // ← ajouté
import './ExerciseList.css';

function ExerciseList() {
  const navigate = useNavigate();
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    const survey = storage.get(STORAGE_KEYS.USER_SURVEY);
    const filtered = filterExercisesByProfile(survey);
    setExercises(filtered);
  }, []);

  const exercisesByStatus = {
    recommended: exercises.filter(ex => ex.status === 'recommended'),
    modified: exercises.filter(ex => ex.status === 'modified'),
    avoid: exercises.filter(ex => ex.status === 'avoid')
  };

  return (
    <div className="exercise-list-page">
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
            {/* ✨ Titre avec animation de frappe */}
            <TextType
              text="Exercices personnalisés"
              typingSpeed={80}
              pauseDuration={2000}
              showCursor={false} // tu peux mettre true si tu veux le curseur
              className="exercise-typing-title"
            />
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
              <span className="section-icon"></span>
              Recommandés
            </h2>
            <div className="exercise-grid">
              {exercisesByStatus.recommended.map((exercise, index) => (
                <ExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  className="recommended animate-in"
                  onSelect={(id, mode) => navigate(`/exercise/${id}/${mode}`)}
                  animationDelay={index * 0.1} // ← on passe le délai
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
              {exercisesByStatus.modified.map((exercise, index) => (
                <ExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  className="animate-in"
                  onSelect={(id, mode) => navigate(`/exercise/${id}/${mode}`)}
                  animationDelay={index * 0.1}
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
              {exercisesByStatus.avoid.map((exercise, index) => (
                <ExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  onSelect={(id, mode) => navigate(`/exercise/${id}/${mode}`)}
                  disabled={true}
                  className="animate-in"
                  animationDelay={index * 0.1}
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
  );
}

export default ExerciseList;