"use client"

import { useState, useEffect } from "react"
import { auth } from "../firebaseConfig"
import { useNavigate } from "react-router-dom"
import { FaMapMarkerAlt, FaDollarSign, FaChartLine, FaParking, FaEye, FaCheckCircle, FaClock } from "react-icons/fa"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import BarChart from "./BarChart"
import PieChart from "./PieChart"
import DashboardCard from "./DashboardCard"
import MetricCard from "./MetricCard"
import Loading from "./Loading"
import "./cssfiles/OwnerDashboard.css"

const OwnerDashboard = () => {
  const [userEmail, setUserEmail] = useState("")
  const [userName, setUserName] = useState("")
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const [dashboardData, setDashboardData] = useState({
    ownerMetrics: null,
    placeBookings: {},
    bookingTrends: [],
    loading: false,
    error: null,
  })

  const [registeredPlaces, setRegisteredPlaces] = useState([])
  const [selectedPlace, setSelectedPlace] = useState(null)
  const [placeBookings, setPlaceBookings] = useState([])
  const [loadingPlaceBookings, setLoadingPlaceBookings] = useState(false)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUserEmail(user.email)
        setUserName(extractNameFromEmail(user.email))
        await fetchOwnerData(user.email)
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

  const fetchOwnerData = async (email) => {
    setLoading(true)
    setDashboardData((prev) => ({ ...prev, loading: true, error: null }))

    try {
      const [placesRes, dashboardRes, bookingTrendsRes] = await Promise.all([
        fetch(`${process.env.REACT_APP_API_URL}/api/profile/places/${email}`),
        fetch(`${process.env.REACT_APP_API_URL}/api/dashboard/owner/${email}`),
        fetch(`${process.env.REACT_APP_API_URL}/api/dashboard/booking-trends?period=daily&days=30`),
      ])

      const [places, ownerMetrics, bookingTrends] = await Promise.all([
        placesRes.json(),
        dashboardRes.json(),
        bookingTrendsRes.json(),
      ])

      setRegisteredPlaces(places)
      setDashboardData({
        ownerMetrics,
        bookingTrends,
        loading: false,
        error: null,
      })
    } catch (error) {
      console.error("Error fetching owner data:", error)
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

  const viewPlaceBookings = async (place) => {
    try {
      setLoadingPlaceBookings(true)
      setSelectedPlace(place)

      const placeIdentifier = place.placeName
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/profile/bookings/place/${placeIdentifier}`)
      const data = await res.json()
      setPlaceBookings(data)
    } catch (error) {
      console.error("Error fetching place bookings:", error)
      toast.error("Error fetching bookings for this place.")
    } finally {
      setLoadingPlaceBookings(false)
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

  const formatPlaceRevenueData = () => {
    if (!dashboardData.ownerMetrics?.placeMetrics) return { labels: [], datasets: [] }

    const placeMetrics = dashboardData.ownerMetrics.placeMetrics
    return {
      labels: placeMetrics.map((place) => place.placeName || place.placeId),
      datasets: [
        {
          label: "Revenue (₹)",
          data: placeMetrics.map((place) => Number.parseFloat(place.revenue)),
          backgroundColor: "#7a1a32",
        },
      ],
    }
  }

  const formatPlaceBookingsData = () => {
    if (!dashboardData.ownerMetrics?.placeMetrics) return { labels: [], values: [] }

    const placeMetrics = dashboardData.ownerMetrics.placeMetrics
    return {
      labels: placeMetrics.map((place) => place.placeName || place.placeId),
      values: placeMetrics.map((place) => place.bookings),
      label: "Total Bookings",
    }
  }

  const formatVerificationStatusData = () => {
    if (!registeredPlaces.length) return { labels: [], values: [] }

    const verified = registeredPlaces.filter((place) => place.verified).length
    const pending = registeredPlaces.length - verified

    return {
      labels: ["Verified", "Pending Verification"],
      values: [verified, pending],
      label: "Place Status",
    }
  }

  if (loading) {
    return <Loading />
  }

  return (
    <div className="owner-dashboard">
      <div className="dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <div className="owner-info">
            <div className="avatar">{getInitials(userEmail)}</div>
            <div className="owner-details">
              <h1>Owner Dashboard</h1>
              <h2>Welcome, {userName}</h2>
              <p className="user-email">{userEmail}</p>
            </div>
          </div>
        </div>

        {dashboardData.loading ? (
          <Loading />
        ) : dashboardData.error ? (
          <div className="error-message">
            <p>Error: {dashboardData.error}</p>
            <button onClick={() => fetchOwnerData(userEmail)} className="retry-button">
              Retry
            </button>
          </div>
        ) : (
          <>
            {/* Key Metrics */}
            <div className="metrics-grid">
              <MetricCard
                title="Total Revenue"
                value={`₹${dashboardData.ownerMetrics?.totalRevenue || "0"}`}
                subtitle="From all places"
                icon={<FaDollarSign />}
                color="green"
              />
              <MetricCard
                title="Total Bookings"
                value={dashboardData.ownerMetrics?.totalBookings || "0"}
                subtitle="Across all places"
                icon={<FaChartLine />}
                color="blue"
              />
              <MetricCard
                title="Registered Places"
                value={dashboardData.ownerMetrics?.totalPlaces || "0"}
                subtitle={`${registeredPlaces.filter((p) => p.verified).length} verified`}
                icon={<FaMapMarkerAlt />}
                color="purple"
              />
              <MetricCard
                title="Average Revenue"
                value={`₹${
                  dashboardData.ownerMetrics?.totalBookings > 0
                    ? (
                        Number.parseFloat(dashboardData.ownerMetrics.totalRevenue) /
                        dashboardData.ownerMetrics.totalBookings
                      ).toFixed(2)
                    : "0"
                }`}
                subtitle="Per booking"
                icon={<FaParking />}
                color="yellow"
              />
            </div>

            {/* Charts Grid */}
            <div className="charts-grid">
              <DashboardCard title="Revenue by Place">
                <BarChart
                  data={formatPlaceRevenueData()}
                  height={300}
                  xAxisLabel="Places"
                  yAxisLabel="Revenue (₹)"
                  colors={["#7a1a32"]}
                />
              </DashboardCard>

              <DashboardCard title="Verification Status">
                <PieChart data={formatVerificationStatusData()} height={300} />
              </DashboardCard>

              <DashboardCard title="Bookings by Place" className="full-width">
                <BarChart
                  data={formatPlaceBookingsData()}
                  height={300}
                  xAxisLabel="Places"
                  yAxisLabel="Number of Bookings"
                  colors={["#7a1a32"]}
                />
              </DashboardCard>
            </div>

            {/* Places Management */}
            <DashboardCard title="Your Places" className="full-width">
              <div className="places-grid">
                {registeredPlaces.length > 0 ? (
                  registeredPlaces.map((place) => (
                    <div key={place.id} className="place-card-owner">
                      <div className="place-header">
                        <h4>
                          <FaMapMarkerAlt /> {place.placeName}
                        </h4>
                        <span className={`status-badge ${place.verified ? "verified" : "pending"}`}>
                          {place.verified ? (
                            <>
                              <FaCheckCircle /> Verified
                            </>
                          ) : (
                            <>
                              <FaClock /> Pending
                            </>
                          )}
                        </span>
                      </div>

                      <div className="place-details">
                        <p>
                          <strong>Address:</strong> {place.address}
                        </p>
                        <p>
                          <strong>Access Type:</strong> {place.accessType}
                        </p>
                        <p>
                          <strong>Date Range:</strong> {place.dateRange?.from} - {place.dateRange?.to}
                        </p>
                        <p>
                          <strong>Charge:</strong> ₹{place.charge}
                        </p>
                      </div>

                      <div className="place-actions">
                        <button onClick={() => viewPlaceBookings(place)} className="view-bookings-btn">
                          <FaEye /> View Bookings
                        </button>
                      </div>

                      {/* Place-specific metrics */}
                      {dashboardData.ownerMetrics?.placeMetrics && (
                        <div className="place-metrics">
                          {dashboardData.ownerMetrics.placeMetrics
                            .filter((metric) => metric.placeName === place.placeName)
                            .map((metric) => (
                              <div key={metric.placeId} className="metric-row">
                                <span>Revenue: ₹{metric.revenue}</span>
                                <span>Bookings: {metric.bookings}</span>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="no-places">
                    <p>No places registered yet.</p>
                    <button onClick={() => navigate("/register-place")} className="register-place-btn">
                      Register Your First Place
                    </button>
                  </div>
                )}
              </div>
            </DashboardCard>
          </>
        )}

        {/* Place Bookings Modal */}
        {selectedPlace && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Bookings for {selectedPlace.placeName}</h3>
                <button className="close-modal-btn" onClick={() => setSelectedPlace(null)}>
                  ×
                </button>
              </div>

              <div className="modal-body">
                {loadingPlaceBookings ? (
                  <Loading />
                ) : placeBookings.length > 0 ? (
                  <div className="bookings-list">
                    {placeBookings.map((booking) => (
                      <div key={booking.id} className="booking-card">
                        <div className="booking-header">
                          <span className={`status-badge ${getBookingStatus(booking).toLowerCase()}`}>
                            {getBookingStatus(booking)}
                          </span>
                          <span className="booking-id">#{booking.id}</span>
                        </div>

                        <div className="booking-details">
                          <div className="detail-row">
                            <span className="label">License Plate:</span>
                            <span className="value">{booking.licensePlate}</span>
                          </div>
                          <div className="detail-row">
                            <span className="label">Vehicle Type:</span>
                            <span className="value">{booking.vehicleType}</span>
                          </div>
                          <div className="detail-row">
                            <span className="label">Check-in:</span>
                            <span className="value">{booking.checkin}</span>
                          </div>
                          <div className="detail-row">
                            <span className="label">Check-out:</span>
                            <span className="value">{booking.checkout}</span>
                          </div>
                          <div className="detail-row revenue">
                            <span className="label">Revenue:</span>
                            <span className="value">₹{booking.total_amount}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-bookings">No bookings found for this place.</p>
                )}
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

export default OwnerDashboard
