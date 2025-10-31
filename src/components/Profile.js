import React, { useState, useEffect } from 'react';
import { auth } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import './cssfiles/Profile.css';
import { FaCar, FaMapMarkerAlt, FaParking, FaMoneyBill, FaTrash, FaBell, FaCog } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import './cssfiles/toastStyles.css';

const Profile = () => {
    const [bookings, setBookings] = useState([]);
    const [registeredPlaces, setRegisteredPlaces] = useState([]);
    const [userEmail, setUserEmail] = useState('');
    const [userName, setUserName] = useState('');
    const [notifications, setNotifications] = useState([]);
    const [activeTab, setActiveTab] = useState('bookings'); 
    const [placeBookings, setPlaceBookings] = useState([]); // Bookings for selected place
    const [selectedPlace, setSelectedPlace] = useState(null); // Currently selected place
    const [loadingPlaceBookings, setLoadingPlaceBookings] = useState(false);
const [showDemoVideo, setShowDemoVideo] = useState(false);
const [demoEntryTime, setDemoEntryTime] = useState(null);
const [demoExitTime, setDemoExitTime] = useState(null);



    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                setUserEmail(user.email);
                setUserName(extractNameFromEmail(user.email));
                await fetchProfileData(user.email);
            } else {
                navigate('/login'); 
            }
        });
        return () => unsubscribe(); 
    }, [navigate]);


    const extractNameFromEmail = (email) => {
        const namePart = email.split('@')[0];
        const nameSegments = namePart.split(/[\._]/);
        const firstName = nameSegments[0].replace(/\d+/g, '');
        const lastName = nameSegments[1] ? nameSegments[1].replace(/\d+/g, '') : '';
        const capitalizedFirstName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
        const capitalizedLastName = lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase();
        return `${capitalizedFirstName} ${capitalizedLastName}`.trim();
    };

    const getInitials = (email) => {
        if (email) {
            const namePart = email.split('@')[0];
            return namePart.split('.').map(name => name.charAt(0).toUpperCase()).join('');
        }
        return '';
    };

    const fetchProfileData = async (email) => {
        try {
            const [bookingsRes, placesRes] = await Promise.all([
                fetch(`${process.env.REACT_APP_API_URL}/api/profile/bookings/${email}`),
                fetch(`${process.env.REACT_APP_API_URL}/api/profile/places/${email}`)
            ]);

            setBookings(await bookingsRes.json());
            setRegisteredPlaces(await placesRes.json());

            // Sample notifications
            setNotifications([
                { id: 1, message: "Your booking for Parking Spot A is confirmed!", date: "2024-10-28" },
                { id: 2, message: "Check-in reminder: Parking Spot B tomorrow at 10 AM.", date: "2024-10-29" },
            ]);
        } catch (error) {
            console.error("Error fetching profile data:", error);
            toast.error("Error fetching profile data.");
        }
    };

    const getBookingStatus = (booking) => {
        const now = new Date();
        const checkinDate = new Date(booking.checkin);
        const checkoutDate = new Date(booking.checkout);
        if (now < checkinDate) return 'Upcoming';
        if (now >= checkinDate && now <= checkoutDate) return 'Active';
        return 'Completed';
    };

    const handleTabClick = (tabName) => setActiveTab(tabName);

    const handleDeletePlace = async (placeId) => {
        try {
            const user = auth.currentUser;
            if (user) {
                await fetch(`${process.env.REACT_APP_API_URL}/api/profile/places/${user.email}/${placeId}`, { method: "DELETE" });
                setRegisteredPlaces(prev => prev.filter(place => place.id !== placeId));
                toast.success("Place deleted successfully.");
            }
        } catch (error) {
            console.error("Error deleting place:", error);
            toast.error("Error deleting place.");
        }
    };

   const viewPlaceBookings = async (place) => {
    try {
        setLoadingPlaceBookings(true);
        setSelectedPlace(place);

        // Use the correct property from registeredPlaces
        const placeIdentifier = place.placeName;
        
        console.log("🔍 Fetching bookings for place:", {
            place: place,
            placeName: place.placeName,
            placeId: place.id,
            identifier: placeIdentifier
        });

        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/profile/bookings/place/${encodeURIComponent(placeIdentifier)}`);
        
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        console.log("📊 Received bookings data:", data);
        setPlaceBookings(data);
        
        if (data.length === 0) {
            console.log("⚠️ No bookings found for this place");
        }
    } catch (error) {
        console.error("Error fetching place bookings:", error);
        toast.error("Error fetching bookings for this place.");
    } finally {
        setLoadingPlaceBookings(false);
    }
};
    const checkDetectedValidity = (booking, entryTime, exitTime) => {
      if (!entryTime || !exitTime) return "Pending Verification";

      const checkin = new Date(booking.checkin);
      const checkout = new Date(booking.checkout);
      const entry = new Date(entryTime);
      const exit = new Date(exitTime);

      if (entry >= checkin && exit <= checkout) {
        return "Valid Parking";
      } else {
        return "Time Mismatch";
      }
    };


    return (
        <div className='Profilebackground'>
            <div className="profile-container">
                <div className="header1">
                    <div className="avatar">{getInitials(userEmail)}</div>
                    <h2>Welcome, {userName}</h2>
                    <p className="user-email">{userEmail}</p>
                </div>

                <div className="tab-navigation">
                    <button className={`tab-buttonpro ${activeTab === 'bookings' ? 'active-tab' : ''}`} onClick={() => handleTabClick('bookings')}>
                        <FaCar /> <span>Bookings</span>
                    </button>
                    <button className={`tab-buttonpro ${activeTab === 'places' ? 'active-tab' : ''}`} onClick={() => handleTabClick('places')}>
                        <FaMapMarkerAlt /> <span>Registered Places</span>
                    </button>
                    <button className={`tab-buttonpro ${activeTab === 'notifications' ? 'active-tab' : ''}`} onClick={() => handleTabClick('notifications')}>
                        <FaBell /> <span>Notifications</span>
                    </button>
                    <button className={`tab-buttonpro ${activeTab === 'settings' ? 'active-tab' : ''}`} onClick={() => handleTabClick('settings')}>
                        <FaCog /> <span>Settings</span>
                    </button>
                    <button 
  className={`tab-buttonpro ${activeTab === 'documents' ? 'active-tab' : ''}`} 
  onClick={() => handleTabClick('documents')}
>
  <FaTrash /> <span>Documents</span>
</button>

                </div>

                {activeTab === 'bookings' && (
                    <div className="section">
                        <h3 className="section-heading">Your Bookings</h3>
                        <div className="section-space"></div>
                        {bookings.length > 0 ? (
                            <div className="card-container">
                                {bookings.map((booking) => (
                                    <div key={booking.id} className="card">
                                        <span className={`badge1 ${getBookingStatus(booking).toLowerCase()}`}>
                                            {getBookingStatus(booking)}
                                        </span>
                                        <h4><FaParking /> Booking ID: {booking.id}</h4>
                                        <p><strong>Place:</strong> {booking.place}</p>
                                        <p><strong>License Plate:</strong> {booking.licensePlate}</p>
                                        <p><strong>Check-in:</strong> {booking.checkin}</p>
                                        <p><strong>Check-out:</strong> {booking.checkout}</p>
                                        <p><strong>Vehicle Type:</strong> {booking.vehicleType}</p>
                                        <p><FaMoneyBill /> <strong>Charge:</strong> Rs. {booking.total_amount}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (<p>No bookings found.</p>)}
                    </div>
                )}


                {activeTab === 'documents' && (
  <div className="section">
    <h3 className="section-heading">Your Documents</h3>

    <div className="card-container">
      <div className="card">
        <h4>Aadhaar Card</h4>

        {/* Directly show Aadhaar image */}
        {registeredPlaces.length > 0 && registeredPlaces[0].documents?.aashaarcard ? (
          <img 
            src={registeredPlaces[0].documents.aashaarcard} 
            alt="Aadhaar Card" 
            style={{ width: "100%", maxWidth: "400px", borderRadius: "8px" }} 
          />
        ) : (
          <p>No Aadhaar available.</p>
        )}
      </div>
    </div>
  </div>
)}



                {activeTab === 'places' && (
                    <div className="section">
                        <h3 className="section-heading">Registered Places</h3>
                        <div className="section-space"></div>
                        {registeredPlaces.length > 0 ? (
                            <div className="card-container">
                                {registeredPlaces.map((place) => (
                                    <div key={place.id} className="card">
                                        <h4><FaMapMarkerAlt /> {place.placeName}</h4>
                                        <p><strong>Address:</strong> {place.address}</p>
                                        <p><strong>Start Date:</strong> {place.dateRange.from}</p>
                                        <p><strong>End Date:</strong> {place.dateRange.to}</p>
                                        <p><strong>Access Type:</strong> {place.accessType}</p>
                                        <button onClick={() => viewPlaceBookings(place)} className="delete-button">
                                            View Bookings
                                        </button>
                                        <button onClick={() => handleDeletePlace(place.id)} className="delete-button">
                                            <FaTrash /> Delete
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (<p>No registered places found.</p>)}
{selectedPlace && (
  <div className="overlay">
    <div className="overlay-card">
      <div className="overlay-header">
        <h4>Bookings for {selectedPlace.placeName}</h4>
        <button className="close-x-btn" onClick={() => setSelectedPlace(null)}>
          ×
        </button>
      </div>

      <div className="overlay-card-content">
        {/* Button to view live/demo feed */}
        <button
          className="live-feed-btn"
          onClick={() => {
            setShowDemoVideo(true); // show video immediately

            // Reset demo times before running
            setDemoEntryTime(null);
            setDemoExitTime(null);
            console.log("🔄 Starting demo feed...");

            // Run demo script asynchronously
           fetch(`${process.env.REACT_APP_API_URL}/api/run-demo`)
          .then(res => res.json())
          .then(data => {
            console.log("📦 Full demo response data:", data);
            console.log("📦 Entry Time from backend:", data.entryTime);
            console.log("📦 Exit Time from backend:", data.exitTime);
            
            if (data.entryTime && data.entryTime !== "Not detected") {
              console.log("✅ Setting entry time in state:", data.entryTime);
              setDemoEntryTime(data.entryTime);
            } else {
              console.warn("⚠️ Entry time not detected or invalid");
            }
            
            if (data.exitTime && data.exitTime !== "Not detected") {
              console.log("✅ Setting exit time in state:", data.exitTime);
              setDemoExitTime(data.exitTime);
            } else {
              console.warn("⚠️ Exit time not detected or invalid");
            }
          })
          .catch(err => console.error("❌ Error running demo:", err));

          }}
        >
            Run Demo Feed
        </button>

        {loadingPlaceBookings ? (
          <p>Loading...</p>
        ) : (
          placeBookings.length > 0 ? (
            <div className="card-container">
              {placeBookings.map((booking) => (
                <div key={booking.id} className="overlay-booking-card">
                  <div className="booking-header">
                    <span className={`badge1 ${getBookingStatus(booking).toLowerCase()}`}>
                      {getBookingStatus(booking)}
                    </span>
                    <h5>Booking #{booking.id}</h5>
                  </div>

                  <div className="booking-details">
                    <div className="detail-row">
                      <span className="label">Check-in:</span>
                      <span className="value">{booking.checkin}</span>
                    </div>

                    <div className="detail-row">
                      <span className="label">Check-out:</span>
                      <span className="value">{booking.checkout}</span>
                    </div>

                    <div className="detail-row">
                      <span className="label">Vehicle Type:</span>
                      <span className="value">{booking.vehicleType}</span>
                    </div>

                    <div className="detail-row charge">
                      <span className="label">Charge:</span>
                      <span className="value">Rs. {booking.total_amount}</span>
                    </div>

                    {/* Detected Times */}
                    <div className="detail-row">
                      <span className="label">Detected Entry Time:</span>
                      <span className="value">{demoEntryTime || "--"}</span>
                    </div>

                    <div className="detail-row">
                      <span className="label">Detected Exit Time:</span>
                      <span className="value">{demoExitTime || "--"}</span>
                    </div>
                    
                    {/* Debug: Show what values are in state */}
                    {console.log(`🖥️ Displaying - Entry: ${demoEntryTime}, Exit: ${demoExitTime}`)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No bookings for this place.</p>
          )
        )}
      </div>

      <div className="overlay-card-footer">
        <button className="close-overlay-btn" onClick={() => setSelectedPlace(null)}>
          Close
        </button>
      </div>
    </div>

    {/* Demo video overlay */}
    {showDemoVideo && (
      <div className="demo-video-overlay">
        <div className="demo-video-card">
          <div className="demo-video-header">
            <h4>Demo Feed</h4>
            <button className="close-x-btn" onClick={() => setShowDemoVideo(false)}>
              ×
            </button>
          </div>
          
          <div className="demo-video-content">
            <video width="640" height="360" controls autoPlay>
              <source src="/car_demo.mp4" type="video/mp4" />
            </video>
            
            <div style={{ marginTop: '15px' }}>
              <button className="demo-close-btn" onClick={() => setShowDemoVideo(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    )}

  </div>
)}


                    </div>
                )}

                {activeTab === 'notifications' && (
                    <div className="section">
                        <h3 className="section-heading">Notifications</h3>
                        {notifications.length > 0 ? (
                            <ul className="notification-list">
                                {notifications.map((notification) => (
                                    <li key={notification.id} className="notification-item">
                                        <p>{notification.message}</p>
                                        <span className="notification-date">{notification.date}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (<p>No notifications found.</p>)}
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="section">
                        <h3 className="section-heading">Account Settings</h3>
                        <p>You can update your account information and preferences here.</p>
                        <button className="settings-button" onClick={() => navigate('/settings')}>
                            <FaCog /> Manage Account
                        </button>
                    </div>
                )}

                <ToastContainer position="top-right" autoClose={8080} hideProgressBar={false} closeOnClick draggable pauseOnHover />
            </div>
        </div>
    );
};

export default Profile;
