import React from 'react';
import './TransactionList.css';

const TransactionList = ({ transactions, onDeleteTransaction }) => {
  // Category colors matching Statistics component
  const categoryColors = {
    'Food': '#FF6B6B',
    'Transportation': '#4ECDC4',
    'Clothing': '#45B7D1',
    'Loan Interest': '#96CEB4',
    'Alcohol': '#FFEAA7',
    'Housing': '#DDA0DD',
    'Subscriptions': '#98D8C8',
    'Hobbies': '#F7DC6F',
    'Ceremony': '#FFB6C1',
    'Part-time Job': '#85C1E9',
    'Allowance': '#F8C471',
    'Investment Income': '#82E0AA'
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ko-KR').format(amount) + ' KRW';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US');
  };

  const handleDelete = async (id) => {
    await onDeleteTransaction(id);
  };

  if (transactions.length === 0) {
    return (
      <div className="transaction-list">
        <h2>Transactions</h2>
        <div className="empty-state">
          <p>No transactions yet.</p>
          <p>Add a new transaction to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="transaction-list">
      <h2>Transactions ({transactions.length})</h2>
      <div className="transactions-container">
        {transactions.map(transaction => (
          <div key={transaction.id} className={`transaction-item ${transaction.type}`}>
            <div className="transaction-info">
              <div className="transaction-main">
                <div className="category-info">
                  <span 
                    className="category-color" 
                    style={{ backgroundColor: categoryColors[transaction.category] || '#666666' }}
                  ></span>
                  <span className="category">{transaction.category}</span>
                </div>
                <span className={`amount ${transaction.type}`}>
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </span>
              </div>
              <div className="transaction-details">
                <span className="date">{formatDate(transaction.date)}</span>
                {transaction.description && (
                  <span className="description">{transaction.description}</span>
                )}
              </div>
            </div>
            <button 
              className="delete-btn"
              onClick={() => handleDelete(transaction.id)}
              title="Delete"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionList;
