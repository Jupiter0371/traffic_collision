import React, { useEffect, useState } from 'react';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import config from '../config.json'; // Ensure this path is correct based on your project structure

export default function TopCollisionsTable() {
  const [topCollisions, setTopCollisions] = useState([]);

  useEffect(() => {
    // Replace the URL with your actual backend URL or use config to construct it
    const url = `http://${config.server_host}:${config.server_port}/Top10_collision_type`;
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setTopCollisions(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  return (
    <Container>
      <TableContainer component={Paper} style={{ marginTop: '20px', boxShadow: '0 3px 10px rgba(0, 0, 0, 0.2)' }}>
        <Table style={{ minWidth: '650px' }}>
          <TableHead>
            <TableRow style={{ backgroundColor: '#f5f5f5' }}>
              <TableCell style={{ color: '#333', fontWeight: 'bold' }}>Type of Collision</TableCell>
              <TableCell style={{ color: '#333', fontWeight: 'bold', textAlign: 'center' }}>Party Count</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {topCollisions.map((row, index) => (
              <TableRow key={index} style={{ borderBottom: '1px solid #eee' }}>
                <TableCell component="th" scope="row" style={{ color: '#555' }}>
                  {row.type_of_collision}
                </TableCell>
                <TableCell align="center" style={{ color: '#555' }}>{row.party_count}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}  