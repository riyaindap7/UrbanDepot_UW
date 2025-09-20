import React, { useEffect, useState } from "react";
import { FaTrash } from 'react-icons/fa';

import AdminSidebar from "./AdminSidebar";
import "./AdminPage.css";
import Forpay from "./ForPay";
import Loading from "./Loading";

const AdminPage = () => {
  const [places, setPlaces] = useState([])
  const [activeTab, setActiveTab] = useState("registered")
  const [activeSubTab, setActiveSubTab] = useState("verified")
  const [loading, setLoading] = useState(true)

  // Fetch places from backend
  const fetchPlaces = async () => {
    setLoading(true)
    try {
      const response = await fetch("http://localhost:5000/api/places");
      const data = await response.json();
      setPlaces(data);
    } catch (error) {
      console.error("Error fetching places:", error)
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPlace = async (placeId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/verify/${placeId}`, {
        method: "POST",
      });

      if (response.ok) {
        // Refetch data or update locally
        setPlaces(prev =>
          prev.map(p => (p.id === placeId ? { ...p, verified: true } : p))
        );
      } else {
        console.error("Failed to verify place");
      }
    } catch (error) {
      console.error("Error verifying place:", error)
    }
  }

  const handleDeletePlace = async (placeId) => {
    if (window.confirm("Are you sure you want to delete this place?")) {
      try {
        const response = await fetch(`http://localhost:5000/api/places/${placeId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setPlaces((prev) => prev.filter((p) => p.id !== placeId));
          alert("Place deleted successfully");
        } else {
          console.error("Failed to delete place");
        }
      } catch (error) {
        console.error("Error deleting place:", error)
      }
    }
  }

  useEffect(() => {
    fetchPlaces();
  }, []);

  const verifiedPlaces = places.filter((place) => place.verified);
  const nonVerifiedPlaces = places.filter((place) => !place.verified);

  return (
    <div className="admin-page">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="main-content">
        {activeTab === "statistics" && (
          <div className="statistics-dashboard">
            <div className="dashboard-header">
              <h2>Statistics Overview</h2>
              <p>Comprehensive analytics and insights for UrbanDepot platform</p>
            </div>

            {dashboardData.loading ? (
              <Loading />
            ) : dashboardData.error ? (
              <div className="error-message">
                <p>Error: {dashboardData.error}</p>
                <button onClick={fetchDashboardData} className="retry-button">
                  Retry
                </button>
              </div>
            ) : (
              <>
                {/* Key Metrics Cards */}
                <div className="metrics-grid">
                  <MetricCard
                    title="Total Revenue"
                    value={`₹${dashboardData.revenueInsights?.totalRevenue || "0"}`}
                    subtitle="Platform fees collected"
                    icon={<FaDollarSign />}
                    color="green"
                  />
                  <MetricCard
                    title="Total Bookings"
                    value={dashboardData.revenueInsights?.totalBookings || "0"}
                    subtitle="All time bookings"
                    icon={<FaChartLine />}
                    color="blue"
                  />
                  <MetricCard
                    title="Active Users"
                    value={dashboardData.userActivity?.length || "0"}
                    subtitle="Users with bookings"
                    icon={<FaUsers />}
                    color="purple"
                  />
                  <MetricCard
                    title="Registered Places"
                    value={places.length}
                    subtitle={`${verifiedPlaces.length} verified`}
                    icon={<FaMapMarkerAlt />}
                    color="yellow"
                  />
                </div>

                {/* Charts Grid */}
                <div className="charts-grid">
                  <DashboardCard title="Booking Trends (Last 30 Days)" className="full-width">
                    <LineChart
                      data={formatBookingTrendsData()}
                      height={300}
                      xAxisLabel="Date"
                      yAxisLabel="Number of Bookings"
                      color="#7a1a32"
                    />
                  </DashboardCard>

                  <DashboardCard title="Revenue by Vehicle Type">
                    <PieChart data={formatRevenueByVehicleData()} height={300} />
                  </DashboardCard>

                  <DashboardCard title="Place Occupancy Rates">
                    <BarChart
                      data={formatOccupancyData()}
                      height={300}
                      xAxisLabel="Places"
                      yAxisLabel="Occupancy Rate (%)"
                      colors={["#7a1a32"]}
                    />
                  </DashboardCard>

                  <DashboardCard title="Top Active Users" className="full-width">
                    <BarChart
                      data={formatUserActivityData()}
                      height={300}
                      xAxisLabel="Users"
                      yAxisLabel="Number of Bookings"
                      colors={["#7a1a32"]}
                    />
                  </DashboardCard>
                </div>

                {/* Revenue Insights Table */}
                {dashboardData.revenueInsights?.revenueByPlace && (
                  <DashboardCard title="Revenue by Place" className="full-width">
                    <div className="revenue-table">
                      <table>
                        <thead>
                          <tr>
                            <th>Place Name</th>
                            <th>Total Revenue</th>
                            <th>Bookings</th>
                            <th>Avg Revenue/Booking</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(dashboardData.revenueInsights.revenueByPlace)
                            .sort(([, a], [, b]) => b.revenue - a.revenue)
                            .slice(0, 10)
                            .map(([placeId, data]) => (
                              <tr key={placeId}>
                                <td>{data.placeName}</td>
                                <td>₹{data.revenue.toFixed(2)}</td>
                                <td>{data.bookings}</td>
                                <td>₹{data.averageRevenue.toFixed(2)}</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </DashboardCard>
                )}
              </>
            )}
          </div>
        )}

        {activeTab === "registered" && (
          <div>
            <div className="notification-banner">
              {activeSubTab === "verified" && <p>Displaying all verified places</p>}
              {activeSubTab === "nonVerified" && <p>Displaying places pending verification</p>}
              {activeSubTab === "verified" && <p>Displaying all verified places</p>}
              {activeSubTab === "nonVerified" && <p>Displaying places pending verification</p>}
            </div>

            <div className="tabs">
              <button
                className={`tab-button ${activeSubTab === "verified" ? "active" : ""}`}
                onClick={() => setActiveSubTab("verified")}
              >
                Verified
              </button>
              <button
                className={`tab-button ${activeSubTab === "nonVerified" ? "active" : ""}`}
                onClick={() => setActiveSubTab("nonVerified")}
              >
                Non-Verified
              </button>
            </div>

            {loading ? (
              <Loading />
            ) : (
              <div className="place-list">
                {activeSubTab === "verified" &&
                  verifiedPlaces.map((place) => (
                    <div key={place.id} className="place-card verified-card">
                      <div className="place-info">
                        <span><b>{place.placeName || "Unknown Place"}</b></span>
                        <span> Address: {place.address}</span>
                        <span> Charge: {place.charge}</span>
                        <span> Availability: {place.availability?.from} - {place.availability?.to}</span>
                        <span> Verified: Yes</span>
                      </div>
                      <FaTrash
                        className="delete-icon"
                        onClick={() => handleDeletePlace(place.id)}
                        style={{ color: "red", cursor: "pointer" }}
                      />
                      <FaTrash
                        className="delete-icon"
                        onClick={() => handleDeletePlace(place.id)}
                        style={{ color: "red", cursor: "pointer" }}
                      />
                    </div>
                  ))}

                {activeSubTab === "nonVerified" &&
                  nonVerifiedPlaces.map((place) => (
                    <div key={place.id} className="place-card non-verified-card">
                      <div className="place-info">
                        <span><b>{place.placeName || "Unknown Place"}</b></span>
                        <span> Address: {place.address}</span>
                        <span> Charge: {place.charge}</span>
                        <span> Availability: {place.availability?.from} - {place.availability?.to}</span>
                        <span> Verified: No</span>
                      </div>
                    <div className="place-actions">
                      <FaTrash
                        className="delete-icon"
                        onClick={() => handleDeletePlace(place.id)}
                        style={{ color: "red", cursor: "pointer" }}
                      />
                      <button
                        className="verify-button"
                        onClick={() => handleVerifyPlace(place.id)}
                      >
                        Verify
                      </button>
                      <FaTrash
                        className="delete-icon"
                        onClick={() => handleDeletePlace(place.id)}
                        style={{ color: "red", cursor: "pointer" }}
                      />
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "payment" && (
          <div className="bookings-list">
            <h3>Payment History</h3>
            <Forpay />
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="notifications-list">
            <h2>Notifications</h2>
          </div>
        )}
      </main>
    </div>
  )
}

export default AdminPage
