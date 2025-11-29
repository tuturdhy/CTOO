// Icône SVG animée d'un sportif avec animation de respiration

function AthleteIcon() {
  return (
    <svg 
      width="120" 
      height="120" 
      viewBox="0 0 120 120" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="breathe"
    >
      {/* Tête */}
      <circle cx="60" cy="25" r="12" fill="#D6001C" />
      
      {/* Corps */}
      <rect x="56" y="37" width="8" height="35" rx="4" fill="#D6001C" />
      
      {/* Bras gauche */}
      <rect x="40" y="40" width="6" height="20" rx="3" fill="#D6001C" transform="rotate(-20 43 50)" />
      
      {/* Bras droit */}
      <rect x="74" y="40" width="6" height="20" rx="3" fill="#D6001C" transform="rotate(20 77 50)" />
      
      {/* Jambes */}
      <rect x="52" y="72" width="6" height="25" rx="3" fill="#D6001C" />
      <rect x="62" y="72" width="6" height="25" rx="3" fill="#D6001C" />
      
      {/* Pieds */}
      <ellipse cx="55" cy="100" rx="8" ry="4" fill="#D6001C" />
      <ellipse cx="65" cy="100" rx="8" ry="4" fill="#D6001C" />
    </svg>
  )
}

export default AthleteIcon

