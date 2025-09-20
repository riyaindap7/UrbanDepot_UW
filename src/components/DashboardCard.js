import "./cssfiles/DashboardCard.css"

const DashboardCard = ({ title, children, className = "", loading = false, error = null }) => {
  return (
    <div className={`dashboard-card ${className}`}>
      <div className="dashboard-card-header">
        <h3 className="dashboard-card-title">{title}</h3>
      </div>
      <div className="dashboard-card-content">
        {loading ? (
          <div className="dashboard-card-loading">
            <div className="loading-spinner"></div>
            <p>Loading...</p>
          </div>
        ) : error ? (
          <div className="dashboard-card-error">
            <p>Error: {error}</p>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  )
}

export default DashboardCard
