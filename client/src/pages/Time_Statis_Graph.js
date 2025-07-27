import React, { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { Container, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const LineChartComponent = () => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [{
            label: 'Total Cases',
            data: [],
            fill: true,
            borderColor: '#4bc0c0',
            backgroundColor: function(context) {
                const chart = context.chart;
                const {ctx, chartArea} = chart;

                if (!chartArea) {
                    // This case happens on initial chart load
                    return;
                }
                const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
                gradient.addColorStop(0, 'rgba(75, 192, 192, 0.2)');
                gradient.addColorStop(1, 'rgba(75, 192, 192, 0.8)');
                return gradient;
            },
            tension: 0.4,
            pointBackgroundColor: '#fff',
            pointBorderColor: '#4bc0c0',
            pointHoverBackgroundColor: '#4bc0c0',
            pointHoverBorderColor: '#fff'
        }]
    });
    const [groupBy, setGroupBy] = useState('year');

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`http://localhost:8080/time_infor_stats/?groupBy=${groupBy}`);
            const data = await response.json();
            if (response.ok) {
                formatDataForChart(data);
            } else {
                throw new Error('Failed to fetch data');
            }
        };
        fetchData();
    }, [groupBy]);

    const timePeriodOrder = ['early_morning', 'morning', 'afternoon', 'evening', 'night'];

    const formatDataForChart = (data) => {
      // Sort data based on the 'groupBy' state
      if (groupBy === 'month') {
        data.sort((a, b) => a.month - b.month);
      } else if (groupBy === 'time_period') {
        data.sort((a, b) => timePeriodOrder.indexOf(a.time_period) - timePeriodOrder.indexOf(b.time_period));
      }

      // Map data to labels and total cases for the chart
      let labels = [];
      let totalCases = [];

      if (groupBy === 'month') {
        labels = data.map(item => item.month.toString());
        totalCases = data.map(item => item.total_cases);
      } else if (groupBy === 'time_period') {
        labels = data.map(item => item.time_period);
        totalCases = data.map(item => item.total_cases);
      } else {
        // Default case, could be 'year' or any other grouping not requiring special sorting
        labels = data.map(item => item[groupBy].toString());
        totalCases = data.map(item => item.total_cases);
      }

        setChartData(prevState => ({
            ...prevState,
            labels,
            datasets: [{
                ...prevState.datasets[0],
                data: totalCases
            }]
        }));
    };

    const handleGroupChange = (event) => {
        setGroupBy(event.target.value);
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true
            }
        },
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    padding: 20,
                    font: {
                        size: 14,
                    }
                }
            },
            title: {
                display: true,
                text: `Total Cases Grouped by ${groupBy.charAt(0).toUpperCase() + groupBy.slice(1)}`,
                font: {
                    size: 24,
                    weight: 'bold'
                }
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: 'rgba(0,0,0,0.8)'
            }
        },
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
        },
        elements: {
            line: {
                fill: 'start'
            },
            point: {
                radius: 5,
                hoverRadius: 7
            }
        },
        animation: {
            duration: 1500
        }
    };

    return (
        <Container>
            <h2>Let's View Some Statistics Graph Related To Time</h2>
            <FormControl fullWidth>
                <InputLabel id="group-by-select-label">Group By</InputLabel>
                <Select
                    labelId="group-by-select-label"
                    id="group-by-select"
                    value={groupBy}
                    onChange={handleGroupChange}
                >
                    <MenuItem value="year">Year</MenuItem>
                    <MenuItem value="month">Month</MenuItem>
                    <MenuItem value="time_period">Time Period</MenuItem>
                </Select>
            </FormControl>
            <Line data={chartData} options={options} />
        </Container>
    );
};

export default LineChartComponent;
