"use client"

import { useState, useEffect } from "react"
import { auth } from "../firebaseConfig"
import { useNavigate } from "react-router-dom"
import { FaCar, FaDollarSign, FaChartLine, FaParking, FaCalendarAlt, FaMapMarkerAlt, FaClock } from "react-icons/fa"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import BarChart from "./BarChart"
import PieChart from "./PieChart"
import LineChart from "./LineChart"
import DashboardCard from "./DashboardCard"
import MetricCard from "./MetricCard"
import Loading from "./Loading"
import "./cssfiles/UserDashboard.css"

const UserDashboard = () => {
  const [userEmail, setUserEmail] = useState("")
  const [userName, setUserName] = useState("")
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const [dashboardData, setDashboardData] = useState({
    userMetrics: null,
    bookings: [],
    bookingTrends: [],
    loading: false,
    error: null,
  })

  const [selectedBooking, setSelectedBooking] = useState(null)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUserEmail(user.email)
        setUserName(extractNameFromEmail(user.email))
        await fetchUserData(user.email)
      } else {
        navigate("/login")
      }
    })
    return () => unsubscribe()
  }, [navigate])

  const extractNameFromEmail = (email) => {
    const namePart = email.split("@")[0]
    const nameSegments = namePart.split(/[._]/)
    const firstName = nameSegments[0].replace(/\d+/g, "")
    const lastName = nameSegments[1] ? nameSegments[1].replace(/\d+/g, "") : ""
    const capitalizedFirstName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase()
    const capitalizedLastName = lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase()
    return `${capitalizedFirstName} ${capitalizedLastName}`.trim()
  }

  const getInitials = (email) => {
    if (email) {
      const namePart = email.split("@")[0]
      return namePart
        .split(".")
        .map((name) => name.charAt(0).toUpperCase())
        .join("")
    }
    return ""
  }

  const fetchUserData = async (email) => {
    setLoading(true)
    setDashboardData((prev) => ({ ...prev, loading: true, error: null }))

    try {
      const [bookingsRes, dashboardRes, bookingTrendsRes] = await Promise.all([
        fetch(`${process.env.REACT_APP_API_URL}/api/profile/bookings/${email}`),
        fetch(`${process.env.REACT_APP_API_URL}/api/dashboard/user/${email}`),
        fetch(`${process.env.REACT_APP_API_URL}/api/dashboard/booking-trends?period=daily&days=30`),
      ])

      const [bookings, userMetrics, bookingTrends] = await Promise.all([
        bookingsRes.json(),
        dashboardRes.json(),
        bookingTrendsRes.json(),
      ])

      setDashboardData({
        userMetrics,
        bookings,
        bookingTrends,
        loading: false,
        error: null,
      })
    } catch (error) {
      console.error("Error fetching user data:", error)
      setDashboardData((prev) => ({
        ...prev,
        loading: false,
        error: "Failed to load dashboard data",
      }))
      toast.error("Error fetching dashboard data.")
    } finally {
      setLoading(false)
    }
  }

  const getBookingStatus = (booking) => {
    const now = new Date()
    const checkinDate = new Date(booking.checkin)
    const checkoutDate = new Date(booking.checkout)
    if (now < checkinDate) return "Upcoming"
    if (now >= checkinDate && now <= checkoutDate) return "Active"
    return "Completed"
  }

  const formatVehicleTypeData = () => {
    if (!dashboardData.userMetrics?.bookingsByVehicleType) return { labels: [], values: [] }

    const vehicleData = dashboardData.userMetrics.bookingsByVehicleType
    return {
      labels: Object.keys(vehicleData).map((key) => key.charAt(0).toUpperCase() + key.slice(1)),
      values: Object.values(vehicleData).map((item) => item.count),
      label: "Bookings by Vehicle Type",
    }
  }

  const formatSpendingByVehicleData = () => {
    if (!dashboardData.userMetrics?.bookingsByVehicleType) return { labels: [], datasets: [] }

    const vehicleData = dashboardData.userMetrics.bookingsByVehicleType
    return {
      labels: Object.keys(vehicleData).map((key) => key.charAt(0).toUpperCase() + key.slice(1)),
      datasets: [
        {
          label: "Total Spent (₹)",
          data: Object.values(vehicleData).map((item) => Number.parseFloat(item.totalSpent)),
          backgroundColor: "#7a1a32",
        },
      ],
    }
  }

  const formatMonthlySpendingData = () => {
    if (!dashboardData.bookings.length) return { labels: [], values: [] }

    // Group bookings by month
    const monthlyData = {}
    dashboardData.bookings.forEach((booking) => {
      if (booking.createdAt) {
        const date = new Date(booking.createdAt)
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
        const monthLabel = date.toLocaleDateString("en-US", { year: "numeric", month: "short" })

        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { label: monthLabel, total: 0 }
        }
        monthlyData[monthKey].total += Number.parseFloat(booking.total_amount || 0)
      }
    })

    const sortedData = Object.values(monthlyData).sort((a, b) => a.label.localeCompare(b.label))

    return {
      labels: sortedData.map((item) => item.label),
      values: sortedData.map((item) => item.total),
      label: "Monthly Spending",
    }
  }

  const getRecentBookings = () => {
    return dashboardData.bookings.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)).slice(0, 5)
  }

  if (loading) {
    return <Loading />
  }

  return (
    <div className="user-dashboard">
      <div className="dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <div className="user-info">
            <div className="avatar">{getInitials(userEmail)}</div>
            <div className="user-details">
              <h1>My Dashboard</h1>
              <h2>Welcome back, {userName}</h2>
              <p className="user-email">{userEmail}</p>
            </div>
          </div>
        </div>

        {dashboardData.loading ? (
          <Loading />
        ) : dashboardData.error ? (
          <div className="error-message">
            <p>Error: {dashboardData.error}</p>
            <button onClick={() => fetchUserData(userEmail)} className="retry-button">
              Retry
            </button>
          </div>
        ) : (
          <>
            {/* Key Metrics */}
            <div className="metrics-grid">
              <MetricCard
                title="Total Spent"
                value={`₹${dashboardData.userMetrics?.totalSpent || "0"}`}
                subtitle="All time spending"
                icon={<FaDollarSign />}
                color="green"
              />
              <MetricCard
                title="Total Bookings"
                value={dashboardData.userMetrics?.totalBookings || "0"}
                subtitle="Parking sessions"
                icon={<FaParking />}
                color="blue"
              />
              <MetricCard
                title="Recent Bookings"
                value={dashboardData.userMetrics?.recentBookingsCount || "0"}
                subtitle="Last 30 days"
                icon={<FaCalendarAlt />}
                color="purple"
              />
              <MetricCard
                title="Average Spent"
                value={`₹${dashboardData.userMetrics?.averageSpentPerBooking || "0"}`}
                subtitle="Per booking"
                icon={<FaChartLine />}
                color="yellow"
              />
            </div>

            {/* Charts Grid */}
            <div className="charts-grid">
              <DashboardCard title="Vehicle Usage">
                <PieChart data={formatVehicleTypeData()} height={300} />
              </DashboardCard>

              <DashboardCard title="Spending by Vehicle Type">
                <BarChart
                  data={formatSpendingByVehicleData()}
                  height={300}
                  xAxisLabel="Vehicle Type"
                  yAxisLabel="Amount Spent (₹)"
                  colors={["#7a1a32"]}
                />
              </DashboardCard>

              <DashboardCard title="Monthly Spending Trend" className="full-width">
                <LineChart
                  data={formatMonthlySpendingData()}
                  height={300}
                  xAxisLabel="Month"
                  yAxisLabel="Amount Spent (₹)"
                  color="#7a1a32"
                />
              </DashboardCard>
            </div>

            {/* Recent Bookings */}
            <DashboardCard title="Recent Bookings" className="full-width">
              <div className="recent-bookings">
                {getRecentBookings().length > 0 ? (
                  <div className="bookings-grid">
                    {getRecentBookings().map((booking) => (
                      <div key={booking.id} className="booking-card-user">
                        <div className="booking-header">
                          <span className={`status-badge ${getBookingStatus(booking).toLowerCase()}`}>
                            {getBookingStatus(booking)}
                          </span>
                          <span className="booking-date">
                            {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : "Unknown date"}
                          </span>
                        </div>

                        <div className="booking-content">
                          <h4>
                            <FaMapMarkerAlt /> {booking.place}
                          </h4>
                          <div className="booking-details">
                            <div className="detail-item">
                              <FaCar />
                              <span>{booking.vehicleType}</span>
                            </div>
                            <div className="detail-item">
                              <span className="license-plate">{booking.licensePlate}</span>
                            </div>
                            <div className="detail-item">
                              <FaClock />
                              <span>
                                {new Date(booking.checkin).toLocaleDateString()} -{" "}
                                {new Date(booking.checkout).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="detail-item amount">
                              <FaDollarSign />
                              <span>₹{booking.total_amount}</span>
                            </div>
                          </div>

                          <button onClick={() => setSelectedBooking(booking)} className="view-details-btn">
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-bookings">
                    <p>No bookings found.</p>
                    <button onClick={() => navigate("/map")} className="book-now-btn">
                      Book Your First Parking
                    </button>
                  </div>
                )}
              </div>
            </DashboardCard>

            {/* Booking Statistics */}
            {dashboardData.bookings.length > 0 && (
              <div className="stats-cards">
                <DashboardCard title="Booking Statistics">
                  <div className="stats-grid">
                    <div className="stat-item">
                      <h4>Most Used Vehicle</h4>
                      <p>
                        {dashboardData.userMetrics?.bookingsByVehicleType &&
                          Object.entries(dashboardData.userMetrics.bookingsByVehicleType).reduce((a, b) =>
                            a[1].count > b[1].count ? a : b,
                          )[0]}
                      </p>
                    </div>
                    <div className="stat-item">
                      <h4>Favorite Parking Duration</h4>
                      <p>
                        {dashboardData.bookings.length > 0
                          ? `${Math.round(
                              dashboardData.bookings.reduce((acc, booking) => {
                                const checkin = new Date(booking.checkin)
                                const checkout = new Date(booking.checkout)
                                return acc + (checkout - checkin) / (1000 * 60 * 60)
                              }, 0) / dashboardData.bookings.length,
                            )} hours avg`
                          : "N/A"}
                      </p>
                    </div>
                    <div className="stat-item">
                      <h4>Total Parking Hours</h4>
                      <p>
                        {dashboardData.bookings.length > 0
                          ? `${Math.round(
                              dashboardData.bookings.reduce((acc, booking) => {
                                const checkin = new Date(booking.checkin)
                                const checkout = new Date(booking.checkout)
                                return acc + (checkout - checkin) / (1000 * 60 * 60)
                              }, 0),
                            )} hours`
                          : "0 hours"}
                      </p>
                    </div>
                  </div>
                </DashboardCard>
              </div>
            )}
          </>
        )}

        {/* Booking Details Modal */}
        {selectedBooking && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Booking Details</h3>
                <button className="close-modal-btn" onClick={() => setSelectedBooking(null)}>
                  ×
                </button>
              </div>

              <div className="modal-body">
                <div className="booking-detail-card">
                  <div className="detail-header">
                    <h4>{selectedBooking.place}</h4>
                    <span className={`status-badge ${getBookingStatus(selectedBooking).toLowerCase()}`}>
                      {getBookingStatus(selectedBooking)}
                    </span>
                  </div>

                  <div className="detail-grid">
                    <div className="detail-row">
                      <span className="label">Booking ID:</span>
                      <span className="value">{selectedBooking.id}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Vehicle Type:</span>
                      <span className="value">{selectedBooking.vehicleType}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">License Plate:</span>
                      <span className="value">{selectedBooking.licensePlate}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Check-in:</span>
                      <span className="value">{selectedBooking.checkin}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Check-out:</span>
                      <span className="value">{selectedBooking.checkout}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Total Amount:</span>
                      <span className="value amount">₹{selectedBooking.total_amount}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Platform Fee:</span>
                      <span className="value">₹{selectedBooking.platform_fee}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Booking Date:</span>
                      <span className="value">
                        {selectedBooking.createdAt
                          ? new Date(selectedBooking.createdAt).toLocaleDateString()
                          : "Unknown"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          closeOnClick
          draggable
          pauseOnHover
        />
      </div>
    </div>
  )
}

export default UserDashboard
