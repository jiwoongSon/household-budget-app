import React, { useState } from 'react';
import './Calendar.css';

const Calendar = ({ transactions, currentMonth, setCurrentMonth }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [dailyTransactions, setDailyTransactions] = useState([]);

  const getDaysInMonth = (year, month) => {
    return new Date(year, month, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month - 1, 1).getDay();
  };

  const formatDate = (date) => {
    return date.toISOString().slice(0, 10);
  };

  const getDailyTotals = (date) => {
    const dateStr = formatDate(date);
    const dayTransactions = transactions.filter(t => t.date === dateStr);
    
    const income = dayTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expense = dayTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return { income, expense, transactions: dayTransactions };
  };

  const formatAmount = (amount) => {
    if (amount >= 1000000) {
      return `${Math.round(amount / 1000000)}M KRW`;
    } else if (amount >= 1000) {
      return `${Math.round(amount / 1000)}K KRW`;
    } else {
      return `${amount} KRW`;
    }
  };

  const navigateMonth = (direction) => {
    try {
      const [year, month] = currentMonth.split('-').map(Number);
      let newYear = year;
      let newMonth = month;

      if (direction === 'prev') {
        newMonth -= 1;
        if (newMonth < 1) {
          newMonth = 12;
          newYear -= 1;
        }
      } else if (direction === 'next') {
        newMonth += 1;
        if (newMonth > 12) {
          newMonth = 1;
          newYear += 1;
        }
      }

      const newMonthString = `${newYear}-${String(newMonth).padStart(2, '0')}`;
      setCurrentMonth(newMonthString);
    } catch (error) {
      console.error('Error in navigateMonth:', error);
    }
  };

  const renderCalendar = () => {
    const [year, month] = currentMonth.split('-').map(Number);
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    const days = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day);
      const totals = getDailyTotals(date);
      
      days.push(
        <div
          key={day}
          className={`calendar-day ${selectedDate === day ? 'selected' : ''}`}
          onClick={() => handleDateClick(day, totals)}
        >
          <div className="day-number">{day}</div>
          {totals.income > 0 && (
            <div className="income-indicator">+{formatAmount(totals.income)}</div>
          )}
          {totals.expense > 0 && (
            <div className="expense-indicator">-{formatAmount(totals.expense)}</div>
          )}
        </div>
      );
    }
    
    return days;
  };

  const handleDateClick = (day, totals) => {
    setSelectedDate(day);
    setDailyTransactions(totals.transactions);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ko-KR').format(amount) + ' KRW';
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getMonthName = () => {
    const [year, month] = currentMonth.split('-');
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button 
          className="nav-button prev" 
          onClick={() => navigateMonth('prev')}
          title="Previous Month"
        >
          ←
        </button>
        <h2>{getMonthName()}</h2>
        <button 
          className="nav-button next" 
          onClick={() => navigateMonth('next')}
          title="Next Month"
        >
          →
        </button>
      </div>
      
      <div className="calendar-grid">
        {dayNames.map(day => (
          <div key={day} className="day-header">{day}</div>
        ))}
        {renderCalendar()}
      </div>

      {selectedDate && (
        <div className="daily-details">
          <h3>Transactions for {selectedDate}</h3>
          {dailyTransactions.length === 0 ? (
            <p>No transactions on this day.</p>
          ) : (
            <div className="daily-transactions">
              {dailyTransactions.map(transaction => (
                <div key={transaction.id} className={`daily-transaction ${transaction.type}`}>
                  <div className="transaction-info">
                    <span className="category">{transaction.category}</span>
                    <span className="amount">
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </span>
                  </div>
                  {transaction.description && (
                    <div className="description">{transaction.description}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Calendar;
