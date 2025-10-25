import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import './Statistics.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const Statistics = ({ transactions, currentMonth, setCurrentMonth }) => {
  const [monthStats, setMonthStats] = useState({
    income: { total: 0, count: 0 },
    expense: { total: 0, count: 0 },
    balance: 0
  });
  const [monthCategoryStats, setMonthCategoryStats] = useState([]);
  const [monthExpenseChartData, setMonthExpenseChartData] = useState(null);
  const [monthIncomeChartData, setMonthIncomeChartData] = useState(null);

  const [customStats, setCustomStats] = useState({
    income: { total: 0, count: 0 },
    expense: { total: 0, count: 0 },
    balance: 0
  });
  const [customCategoryStats, setCustomCategoryStats] = useState([]);
  const [customExpenseChartData, setCustomExpenseChartData] = useState(null);
  const [customIncomeChartData, setCustomIncomeChartData] = useState(null);
  
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  // Category colors for pie chart
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

  useEffect(() => {
    fetchMonthStatistics();
  }, [currentMonth]);

  useEffect(() => {
    if (customStartDate && customEndDate) {
      fetchCustomStatistics();
    }
  }, [customStartDate, customEndDate]);

  const fetchMonthStatistics = async () => {
    try {
      const [year, month] = currentMonth.split('-');
      const startDate = `${year}-${month}-01`;
      const endDate = `${year}-${month}-31`;

      // Filter transactions by month
      const filteredTransactions = transactions.filter(transaction => {
        const transactionDate = transaction.date;
        return transactionDate >= startDate && transactionDate <= endDate;
      });

      calculateStatistics(filteredTransactions, setMonthStats, setMonthCategoryStats, setMonthExpenseChartData, setMonthIncomeChartData);
    } catch (error) {
      console.error('Failed to fetch month statistics:', error);
    }
  };

  const fetchCustomStatistics = async () => {
    try {
      // Filter transactions by custom date range
      const filteredTransactions = transactions.filter(transaction => {
        const transactionDate = transaction.date;
        return transactionDate >= customStartDate && transactionDate <= customEndDate;
      });

      calculateStatistics(filteredTransactions, setCustomStats, setCustomCategoryStats, setCustomExpenseChartData, setCustomIncomeChartData);
    } catch (error) {
      console.error('Failed to fetch custom statistics:', error);
    }
  };

  const calculateStatistics = (filteredTransactions, setStats, setCategoryStats, setExpenseChartData, setIncomeChartData) => {
    // Calculate statistics
    const incomeTransactions = filteredTransactions.filter(t => t.type === 'income');
    const expenseTransactions = filteredTransactions.filter(t => t.type === 'expense');
    
    const incomeTotal = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
    const expenseTotal = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
    
    setStats({
      income: { total: incomeTotal, count: incomeTransactions.length },
      expense: { total: expenseTotal, count: expenseTransactions.length },
      balance: incomeTotal - expenseTotal
    });

    // Calculate category statistics
    const categoryMap = {};
    filteredTransactions.forEach(transaction => {
      const key = `${transaction.category}-${transaction.type}`;
      if (!categoryMap[key]) {
        categoryMap[key] = {
          category: transaction.category,
          type: transaction.type,
          total: 0,
          count: 0
        };
      }
      categoryMap[key].total += transaction.amount;
      categoryMap[key].count += 1;
    });

    const categoryData = Object.values(categoryMap).sort((a, b) => b.total - a.total);
    setCategoryStats(categoryData);

    // Prepare expense chart data
    const expenseCategories = categoryData.filter(item => item.type === 'expense');
    if (expenseCategories.length > 0) {
      const chartData = {
        labels: expenseCategories.map(item => item.category),
        datasets: [
          {
            data: expenseCategories.map(item => item.total),
            backgroundColor: expenseCategories.map(item => categoryColors[item.category] || '#666666'),
            borderColor: '#ffffff',
            borderWidth: 2,
          },
        ],
      };
      setExpenseChartData(chartData);
    } else {
      setExpenseChartData(null);
    }

    // Prepare income chart data
    const incomeCategories = categoryData.filter(item => item.type === 'income');
    if (incomeCategories.length > 0) {
      const chartData = {
        labels: incomeCategories.map(item => item.category),
        datasets: [
          {
            data: incomeCategories.map(item => item.total),
            backgroundColor: incomeCategories.map(item => categoryColors[item.category] || '#666666'),
            borderColor: '#ffffff',
            borderWidth: 2,
          },
        ],
      };
      setIncomeChartData(chartData);
    } else {
      setIncomeChartData(null);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ko-KR').format(amount) + ' KRW';
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#ffffff',
          font: {
            family: 'Monaco, Menlo, Ubuntu Mono, monospace',
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${formatCurrency(value)} (${percentage}%)`;
          }
        }
      }
    }
  };

  const renderStatisticsSection = (title, stats, categoryStats, expenseChartData, incomeChartData, headerContent) => (
    <div className="statistics-section">
      <div className="section-header">
        <h2>{title}</h2>
        {headerContent}
      </div>
      
      <div className="stats-overview">
        <div className="stat-card income">
          <h3>Income</h3>
          <div className="stat-value">{formatCurrency(stats.income.total)}</div>
          <div className="stat-count">{stats.income.count} transactions</div>
        </div>
        
        <div className="stat-card expense">
          <h3>Expense</h3>
          <div className="stat-value">{formatCurrency(stats.expense.total)}</div>
          <div className="stat-count">{stats.expense.count} transactions</div>
        </div>
        
        <div className={`stat-card balance ${stats.balance >= 0 ? 'positive' : 'negative'}`}>
          <h3>Balance</h3>
          <div className="stat-value">{formatCurrency(Math.abs(stats.balance))}</div>
          <div className="stat-label">{stats.balance >= 0 ? 'Surplus' : 'Deficit'}</div>
        </div>
      </div>

      <div className="charts-section">
        {expenseChartData && (
          <div className="chart-section">
            <h3>Expense Breakdown</h3>
            <div className="chart-container">
              <Pie data={expenseChartData} options={chartOptions} />
            </div>
          </div>
        )}

        {incomeChartData && (
          <div className="chart-section">
            <h3>Income Breakdown</h3>
            <div className="chart-container">
              <Pie data={incomeChartData} options={chartOptions} />
            </div>
          </div>
        )}
      </div>

      <div className="category-breakdown">
        <h3>Category Breakdown</h3>
        {categoryStats.length === 0 ? (
          <p className="no-data">No transactions for selected period.</p>
        ) : (
          <div className="category-list">
            {categoryStats.map((item, index) => (
              <div key={index} className="category-item">
                <div className="category-info">
                  <span 
                    className="category-color" 
                    style={{ backgroundColor: categoryColors[item.category] || '#666666' }}
                  ></span>
                  <span className="category-name">{item.category}</span>
                  <span className={`category-type ${item.type}`}>
                    {item.type === 'income' ? 'Income' : 'Expense'}
                  </span>
                </div>
                <div className="category-stats">
                  <span className="category-amount">{formatCurrency(item.total)}</span>
                  <span className="category-count">{item.count} transactions</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="statistics">
      {renderStatisticsSection(
        'Current Month',
        monthStats,
        monthCategoryStats,
        monthExpenseChartData,
        monthIncomeChartData,
        <div className="month-selector">
          <label htmlFor="month">Month:</label>
          <input
            type="month"
            id="month"
            value={currentMonth}
            onChange={(e) => setCurrentMonth(e.target.value)}
            className="month-input"
          />
        </div>
      )}

      {renderStatisticsSection(
        'Custom Range',
        customStats,
        customCategoryStats,
        customExpenseChartData,
        customIncomeChartData,
        <div className="custom-date-inputs">
          <div className="date-input-group">
            <label>Start Date:</label>
            <input
              type="date"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
              className="date-input"
            />
          </div>
          <div className="date-input-group">
            <label>End Date:</label>
            <input
              type="date"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              className="date-input"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Statistics;
