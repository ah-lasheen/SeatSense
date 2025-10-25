import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <h1 className="logo">Stride</h1>
        <p className="tagline">Real-time Library Occupancy Tracker</p>
      </div>
    </header>
  );
};

export default Header;
