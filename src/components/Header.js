import React from 'react';
import './Header.css';

const Header = ({ currentView, setCurrentView, currentMonth, setCurrentMonth }) => {
  return (
    <header className="header">
      <div className="header-content">
        <h1 className="app-title">💰 Budget Tracker</h1>
        
        <nav className="nav-tabs">
          <button 
            className={`nav-tab ${currentView === 'transactions' ? 'active' : ''}`}
            onClick={() => setCurrentView('transactions')}
          >
            Transactions
          </button>
          <button 
            className={`nav-tab ${currentView === 'calendar' ? 'active' : ''}`}
            onClick={() => setCurrentView('calendar')}
          >
            Calendar
          </button>
          <button 
            className={`nav-tab ${currentView === 'statistics' ? 'active' : ''}`}
            onClick={() => setCurrentView('statistics')}
          >
            Statistics
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
