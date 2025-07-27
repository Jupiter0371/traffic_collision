import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import config from '../config.json';
import './Histogram.css'; // Make sure this path is correct for your project structure

// Chart.js components registration
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Container } from '@mui/material';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Histogram = () => {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadChartData = async () => {
    try {
      const response = await fetch(`http://${config.server_host}:${config.server_port}/collision_type_victims`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      if (data && Array.isArray(data) && data.length > 0) {
        const labels = data.map(item => item.type_of_collision);
        const driverInjuredData = data.map(item => item.Average_Driver_Injured);
        const passengerInjuredData = data.map(item => item.Average_Passenger_Injured);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Average Driver Injured',
              data: driverInjuredData,
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
              label: 'Average Passenger Injured',
              data: passengerInjuredData,
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
            }
          ]
        });
      } else {
        setError('No data to display');
      }
    } catch (e) {
      setError(`Failed to fetch data: ${e.message}`);
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadChartData();
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'bottom'
      }
    }
  };

  if (loading) {
    return <div className="chart-container">Loading chart...</div>;
  }

  if (error) {
    return <div className="chart-container">{error}</div>;
  }

  return (
    <Container> 
      <h2>Avg Drivers and Passenger Victims Under Different Collisions Types</h2>
      <div 
      
      className="chart-container">
      <Bar data={chartData} options={options} />
    </div>
    </Container>
    
  );
};

export default Histogram;



