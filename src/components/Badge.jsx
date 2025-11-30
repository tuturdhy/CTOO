import './Badge.css'

function Badge({ badge }) {
  return (
    <div className="badge-card card">
      <div className="badge-icon">🏆</div>
      <h3 className="badge-name">{badge.name}</h3>
      <p className="badge-description">{badge.description}</p>
      {badge.awardedAt && (
        <span className="badge-date">
          {new Date(badge.awardedAt).toLocaleDateString('fr-FR')}
        </span>
      )}
    </div>
  )
}

export default Badge

