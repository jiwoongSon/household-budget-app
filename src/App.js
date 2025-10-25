import React, { useState, useEffect } from 'react';
import './App.css';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import Statistics from './components/Statistics';
import Calendar from './components/Calendar';
import Header from './components/Header';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [currentView, setCurrentView] = useState('transactions');
  const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().slice(0, 7));

  // Fetch transactions
  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/transactions');
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    }
  };

  // Add transaction
  const addTransaction = async (transaction) => {
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transaction),
      });
      
      if (response.ok) {
        fetchTransactions();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to add transaction:', error);
      return false;
    }
  };

  // Delete transaction
  const deleteTransaction = async (id) => {
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        fetchTransactions();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to delete transaction:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="App">
      <Header 
        currentView={currentView} 
        setCurrentView={setCurrentView}
        currentMonth={currentMonth}
        setCurrentMonth={setCurrentMonth}
      />
      
      <main className="main-content">
        {currentView === 'transactions' && (
          <>
            <TransactionForm onAddTransaction={addTransaction} />
            <TransactionList 
              transactions={transactions} 
              onDeleteTransaction={deleteTransaction}
            />
          </>
        )}
        
        {currentView === 'calendar' && (
          <Calendar 
            transactions={transactions}
            currentMonth={currentMonth}
            setCurrentMonth={setCurrentMonth}
          />
        )}
        
        {currentView === 'statistics' && (
          <Statistics 
            transactions={transactions}
            currentMonth={currentMonth}
            setCurrentMonth={setCurrentMonth}
          />
        )}
      </main>
    </div>
  );
}

export default App;
