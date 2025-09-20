import React, { useState } from 'react';
import './cssfiles/AdminSidebar.css';
import { FaChartLine, FaList, FaClipboardList, FaSignOutAlt, FaBars } from 'react-icons/fa';
import { auth } from "../firebaseConfig";
import { useNavigate } from 'react-router-dom';

const AdminSidebar = ({ activeTab, setActiveTab }) => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false); // for mobile dropdown

    const confirmLogout = () => {
        if (window.confirm("Are you sure you want to log out?")) {
            handleLogout();
        }
    };

    const handleLogout = async () => {
        try {
            await auth.signOut();
            alert("Logged out successfully!");
            navigate('/');
        } catch (error) {
            alert(`Logout Error: ${error.message}`);
        }
    };

    const adminName = "Admin";
    const initial = adminName.charAt(0).toUpperCase();

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="admin-sidebar desktop-only">
                <div className="sidebar-header">
                    <h2 className="urban-depot-title">UrbanDepot</h2>
                </div>
                <div className="sidebar-greeting">
                    <div className="avatar">{initial}</div>
                    <p>Welcome, {adminName}</p>
                </div>
                <hr />
                <ul className="sidebar-menu">
                    <li onClick={() => setActiveTab('statistics')} className={activeTab === 'statistics' ? 'active' : ''}>
                        <FaChartLine className="iconadmin" />
                        <span>Statistics Overview</span>
                    </li>
                    <li onClick={() => setActiveTab('registered')} className={activeTab === 'registered' ? 'active' : ''}>
                        <FaList className="iconadmin" />
                        <span>Registered Places List</span>
                    </li>
                    <li onClick={() => setActiveTab('payment')} className={activeTab === 'payment' ? 'active' : ''}>
                        <FaClipboardList className="iconadmin" />
                        <span>Payment History</span>
                    </li>
                    <li onClick={confirmLogout} className="logout">
                        <FaSignOutAlt className="iconadmin" style={{ color: 'red' }} />
                        <span style={{ color: 'red' }}>Logout</span>
                    </li>
                </ul>
            </aside>

            {/* Mobile Navbar */}
            <nav className="admin-navbar mobile-only">
                <div className="navbar-left">
                    <h2 className="urban-depot-title">UrbanDepot</h2>
                    <span className="welcome-text">Welcome, {adminName}</span>
                </div>
                <div className="navbar-right">
                    <FaBars className="hamburger" onClick={() => setIsOpen(!isOpen)} />
                </div>

                {isOpen && (
                    <ul className="mobile-dropdown">
                        <li onClick={() => setActiveTab('statistics')}>Statistics Overview</li>
                        <li onClick={() => setActiveTab('registered')}>Registered Places List</li>
                        <li onClick={() => setActiveTab('payment')}>Payment History</li>
                        <li onClick={confirmLogout} style={{ color: 'red' }}>Logout</li>
                    </ul>
                )}
            </nav>
        </>
    );
};

export default AdminSidebar;
