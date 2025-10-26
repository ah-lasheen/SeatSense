import React, { useState } from 'react';
import './App.css';
import Dashboard from './pages/Dashboard';
import LiveMonitoring from './pages/LiveMonitoring';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard'); // 'dashboard' or 'live'

  return (
    <div className="App">
      {currentPage === 'dashboard' ? (
        <Dashboard onNavigateToLive={() => setCurrentPage('live')} />
      ) : (
        <LiveMonitoring onBack={() => setCurrentPage('dashboard')} />
      )}
    </div>
  );
}

export default App;
