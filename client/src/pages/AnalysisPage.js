import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Container } from '@mui/material';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AlcoholStatsChart = () => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: []
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:8080/alcohol_involved_stats');
                const data = await response.json();
                processChartData(data);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        };
        fetchData();
    }, []);

    const processChartData = (data) => {
        const counties = data.map(item => item.county_location);
        const alcoholInvolved = data.map(item => item.total_alcohol_involved);
        const totalCollisions = data.map(item => item.total_collisions);

        setChartData({
            labels: counties,
            datasets: [
                {
                    label: 'Total Alcohol Involved',
                    data: alcoholInvolved,
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Total Collisions',
                    data: totalCollisions,
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }
            ]
        });
    };

    return (
        <Container>
            <h2>Alcohol Involvement and Traffic Collisions by County</h2>
            <Bar
                data={chartData}
                options={{
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    },
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top'
                        },
                        title: {
                            display: true,
                            text: 'Comparison of Alcohol Involvement and Total Collisions by County'
                        }
                    }
                }}
            />
        </Container>
    );
};

export default AlcoholStatsChart;
