import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import './adminD.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminD = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPurchases, setTotalPurchases] = useState(0);
  const [transactionsPerDay, setTransactionsPerDay] = useState([]);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, 'userIds'));
      const totalUsersCount = usersSnapshot.docs.length; 
  
      const onlineUsersCount = usersSnapshot.docs.filter(doc => doc.data().isLoggedIn === true).length;

  
      setTotalUsers(totalUsersCount);
      setOnlineUsers(onlineUsersCount);
  
      const productsSnapshot = await getDocs(collection(db, 'products'));
      setTotalProducts(productsSnapshot.docs.length);
  
      const transactionsSnapshot = await getDocs(collection(db, 'transactions'));
      const transactions = transactionsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
  
      const transactionsByDay = {};
  
      transactions.forEach(transaction => {
        if (transaction.transactionDate) {
          const date = transaction.transactionDate.toDate(); 
          const dateStr = date.toISOString().split('T')[0]; 
          transactionsByDay[dateStr] = (transactionsByDay[dateStr] || 0) + 1; 
        }
      });
  
      const last7Days = Array.from({ length: 7 }).map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const formattedDate = date.toISOString().split('T')[0];
        return { 
          date: formattedDate, 
          count: transactionsByDay[formattedDate] || 0 
        };
      }).reverse(); // Reverse to show the most recent day on the right
  
      setTransactionsPerDay(last7Days);
      setTotalPurchases(transactions.length); // Total transactions
  
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch dashboard data');
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array ensures this runs once when the component mounts

  // Chart data configuration
  const chartData = {
    labels: transactionsPerDay.map(day => day.date), // Dates for the X-axis
    datasets: [
      {
        label: 'Transactions Per Day',
        data: transactionsPerDay.map(day => day.count), // Count of transactions for each day
        backgroundColor: 'rgba(54, 162, 235, 0.6)', // Blue color for bars
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      }
    ],
  };

  // Chart options to customize the Y-axis
  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true, // Start the Y-axis at 0
        ticks: {
          stepSize: 1, // Ensure whole numbers are shown, so no decimals
          callback: function(value) {
            return value; // Show numbers without decimals (1, 2, 3...)
          }
        }
      }
    },
  };
  

  return (
    <div className="admin-dashboard">
      <h1 className="dashboard-title">Admin Dashboard</h1>
      {error && <p className="error-message">{error}</p>}
      <div className="stats-container">
        <div className="stat-card">
          <h2>Users</h2>
          <p><strong>Total:</strong> {totalUsers}</p>
          <p><strong>Online:</strong> {onlineUsers}</p>
        </div>
        <div className="stat-card">
          <h2>Products</h2>
          <p><strong>Total:</strong> {totalProducts}</p>
        </div>
        <div className="stat-card">
          <h2>Purchases</h2>
          <p><strong>Total:</strong> {totalPurchases}</p>
        </div>
      </div>
      <div className="chart-container">
        <h3>Transactions Per Day in the Last 7 Days</h3>
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default AdminD;
