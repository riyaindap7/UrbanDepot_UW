// src/components/Loading.js

import React from 'react';
import './cssfiles/Loading.css'; // Import the CSS file for styling


const Loading = () => {
    return (
        <div className="loading-indicator">
            <div className="logo-animation">
                <img src="/urbanlogo1.png" alt="Loading Urban Depot logo" className="loading-logo" />
            </div>
        </div>
    );
};

export default Loading;
