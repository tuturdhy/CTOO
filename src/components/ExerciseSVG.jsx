// Composant SVG animé pour les exercices

function ExerciseSVG({ exerciseId, phase }) {
  // SVG simplifié pour chaque exercice et phase
  const getSVGContent = () => {
    switch (exerciseId) {
      case 'squat-modified':
        return getSquatSVG(phase)
      case 'glute-bridge':
        return getGluteBridgeSVG(phase)
      case 'plank-modified':
        return getPlankSVG(phase)
      case 'shoulder-rotation':
        return getShoulderRotationSVG(phase)
      default:
        return getDefaultSVG()
    }
  }

  return (
    <div className="exercise-svg">
      {getSVGContent()}
    </div>
  )
}

function getSquatSVG(phase) {
  const isDown = phase === 'down'
  const headY = isDown ? 35 : 25
  const bodyHeight = isDown ? 45 : 35
  const bodyY = isDown ? 50 : 37
  const legY = isDown ? 95 : 72
  const legHeight = isDown ? 30 : 25

  return (
    <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Tête */}
      <circle cx="100" cy={headY} r="15" fill="#D6001C" />
      
      {/* Corps */}
      <rect x="92" y={bodyY} width="16" height={bodyHeight} rx="6" fill="#D6001C" />
      
      {/* Bras gauche */}
      <rect x="70" y={bodyY + 5} width="8" height="25" rx="4" fill="#D6001C" transform={`rotate(-30 ${74} ${bodyY + 17})`} />
      
      {/* Bras droit */}
      <rect x="122" y={bodyY + 5} width="8" height="25" rx="4" fill="#D6001C" transform={`rotate(30 ${126} ${bodyY + 17})`} />
      
      {/* Jambes */}
      <rect x="88" y={legY} width="10" height={legHeight} rx="5" fill="#D6001C" />
      <rect x="102" y={legY} width="10" height={legHeight} rx="5" fill="#D6001C" />
      
      {/* Pieds */}
      <ellipse cx="93" cy={legY + legHeight} rx="12" ry="6" fill="#D6001C" />
      <ellipse cx="107" cy={legY + legHeight} rx="12" ry="6" fill="#D6001C" />
    </svg>
  )
}

function getGluteBridgeSVG(phase) {
  const isUp = phase === 'up'
  const hipY = isUp ? 120 : 140
  const kneeY = isUp ? 150 : 160
  const footY = isUp ? 170 : 180

  return (
    <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Tête */}
      <circle cx="100" cy="30" r="12" fill="#D6001C" />
      
      {/* Torse */}
      <rect x="92" y="42" width="16" height="40" rx="6" fill="#D6001C" />
      
      {/* Hanches */}
      <ellipse cx="100" cy={hipY} rx="20" ry="15" fill="#D6001C" />
      
      {/* Cuisses */}
      <rect x="88" y={hipY} width="10" height="30" rx="5" fill="#D6001C" />
      <rect x="102" y={hipY} width="10" height="30" rx="5" fill="#D6001C" />
      
      {/* Genoux */}
      <circle cx="93" cy={kneeY} r="8" fill="#D6001C" />
      <circle cx="107" cy={kneeY} r="8" fill="#D6001C" />
      
      {/* Jambes */}
      <rect x="88" y={kneeY} width="10" height="20" rx="5" fill="#D6001C" />
      <rect x="102" y={kneeY} width="10" height="20" rx="5" fill="#D6001C" />
      
      {/* Pieds */}
      <ellipse cx="93" cy={footY} rx="10" ry="5" fill="#D6001C" />
      <ellipse cx="107" cy={footY} rx="10" ry="5" fill="#D6001C" />
    </svg>
  )
}

function getPlankSVG(phase) {
  return (
    <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Tête */}
      <circle cx="80" cy="60" r="12" fill="#D6001C" />
      
      {/* Corps horizontal */}
      <rect x="70" y="72" width="60" height="16" rx="6" fill="#D6001C" />
      
      {/* Bras */}
      <rect x="50" y="75" width="8" height="30" rx="4" fill="#D6001C" />
      <rect x="142" y="75" width="8" height="30" rx="4" fill="#D6001C" />
      
      {/* Jambes */}
      <rect x="70" y="88" width="10" height="40" rx="5" fill="#D6001C" />
      <rect x="120" y="88" width="10" height="40" rx="5" fill="#D6001C" />
      
      {/* Pieds */}
      <ellipse cx="75" cy="130" rx="12" ry="6" fill="#D6001C" />
      <ellipse cx="125" cy="130" rx="12" ry="6" fill="#D6001C" />
    </svg>
  )
}

function getShoulderRotationSVG(phase) {
  const isForward = phase === 'forward'
  const armAngle = isForward ? 45 : -45

  return (
    <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Tête */}
      <circle cx="100" cy="40" r="15" fill="#D6001C" />
      
      {/* Corps */}
      <rect x="92" y="55" width="16" height="50" rx="6" fill="#D6001C" />
      
      {/* Bras gauche */}
      <rect x="70" y="60" width="8" height="35" rx="4" fill="#D6001C" transform={`rotate(${armAngle} 74 77)`} />
      
      {/* Bras droit */}
      <rect x="122" y="60" width="8" height="35" rx="4" fill="#D6001C" transform={`rotate(${-armAngle} 126 77)`} />
      
      {/* Jambes */}
      <rect x="88" y="105" width="10" height="40" rx="5" fill="#D6001C" />
      <rect x="102" y="105" width="10" height="40" rx="5" fill="#D6001C" />
    </svg>
  )
}

function getDefaultSVG() {
  return (
    <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="50" fill="#D6001C" />
    </svg>
  )
}

export default ExerciseSVG

