import "./cssfiles/MetricCard.css"

const MetricCard = ({ title, value, subtitle = "", icon = null, trend = null, color = "blue" }) => {
  const getTrendIcon = () => {
    if (!trend) return null

    if (trend > 0) {
      return <span className="trend-icon trend-up">↗</span>
    } else if (trend < 0) {
      return <span className="trend-icon trend-down">↘</span>
    }
    return <span className="trend-icon trend-neutral">→</span>
  }

  const getTrendText = () => {
    if (!trend) return ""

    const absValue = Math.abs(trend)
    const direction = trend > 0 ? "increase" : trend < 0 ? "decrease" : "no change"
    return `${absValue}% ${direction}`
  }

  return (
    <div className={`metric-card metric-card-${color}`}>
      <div className="metric-card-header">
        {icon && <div className="metric-card-icon">{icon}</div>}
        <h4 className="metric-card-title">{title}</h4>
      </div>

      <div className="metric-card-body">
        <div className="metric-card-value">{value}</div>
        {subtitle && <div className="metric-card-subtitle">{subtitle}</div>}

        {trend !== null && (
          <div className="metric-card-trend">
            {getTrendIcon()}
            <span className="trend-text">{getTrendText()}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default MetricCard
