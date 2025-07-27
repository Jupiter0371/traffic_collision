import { useEffect, useState } from 'react';
import { Button, Container, FormControl, InputLabel, MenuItem, Select, Grid, TextField, CircularProgress } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import config from '../config.json'; 
import React from 'react';





export default function AllTimeInforPage() {
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [time_periods, setTimePeriods] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  


  const search = async () => {
    setIsLoading(true);  // Indicate the start of the fetch operation
  
    fetch(`http://${config.server_host}:${config.server_port}/all_time_infor/${year}/${month}/${time_periods}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        year: year ? [year] : [],
        month: month ? [month] : [],
        time_periods: time_periods ? [time_periods] : [],
      }),
    })
    .then(res => {
      console.log(res)
      if (!res.ok) {
        throw new Error(`Server responded with status: ${res.status}`);
      }
      return res.json();
    })
    .then(resJson => {
      console.log(resJson)
      // Use the index of each item as the id for DataGrid
      const dataWithIds = resJson.map((item, index) => ({ ...item, id: index }));
      setData(dataWithIds);
    })
    .catch(error => {
      console.error("There was an error during the fetch operation", error);
    })
    .finally(() => {
      setIsLoading(false);  // Indicate the end of the fetch operation, whether it was successful or failed
    });
  };
  
  

  

  // Define the columns for your DataGrid based on your data model
  const columns = [
    {
        field: 'case_id',
        headerName: 'Case_id',
        flex: 1,
        headerAlign: 'center',
        align: 'center',
      },
    {
      field: 'collision_timestamp',
      headerName: 'Time',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'county_location',
      headerName: 'Location',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      
    },
    {
        field: 'killed_victims',
        headerName: 'Killed Victims',
        flex: 1,
        headerAlign: 'center',
        align: 'center',
        valueFormatter: ({ value }) => value.toString(), 
      },
    {
      field: 'injured_victims',
      headerName: 'Injured Victims',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      valueFormatter: ({ value }) => value.toString(), 
    },
    {
      field: 'party_count',
      headerName: 'Party Count',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      valueFormatter: ({ value }) => value.toString(), 
    },
    {
      field: 'road_surface',
      headerName: 'Road Surface',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
    },
    {
        field: 'lighting',
        headerName: 'Lighting',
        flex: 1,
        headerAlign: 'center',
        align: 'center',
      },
  ];
  
  
  

  return (
    <Container>
      <h2>Let's Explore Collsions Infor Associated With Collisions Times!</h2>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel id="year-label">Year</InputLabel>
            <Select
              labelId="year-label"
              id="Year"
              value={year}
              label="Year"
              onChange={(e) => setYear(e.target.value)}
              displayEmpty
            >
              {/* Replace with your actual weather conditions */}
              <MenuItem value="" style={{ fontStyle: 'italic', color: 'blue' }}> </MenuItem>
              <MenuItem value="2019">2019</MenuItem>              
              <MenuItem value="2020">2020</MenuItem>
              <MenuItem value="2021">2021</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel id="month-label">Month</InputLabel>
            <Select
              labelId="month-label"
              id="Month"
              value={month}
              label="Month"
              onChange={(e) => setMonth(e.target.value)}
              displayEmpty
            >
              {/* Replace with your actual road conditions */}
              <MenuItem value="" style={{ fontStyle: 'italic', color: 'blue' }}> </MenuItem>
              <MenuItem value="1">1</MenuItem>              
              <MenuItem value="2">2</MenuItem>
              <MenuItem value="3">3</MenuItem>
              <MenuItem value="4">4</MenuItem>
              <MenuItem value="5">5</MenuItem>
              <MenuItem value="6">6</MenuItem>
              <MenuItem value="7">7</MenuItem>
              <MenuItem value="8">8</MenuItem>
              <MenuItem value="9">9</MenuItem>
              <MenuItem value="10">10</MenuItem>
              <MenuItem value="11">11</MenuItem>
              <MenuItem value="12">12</MenuItem>

              {/* Add more MenuItem components as needed */}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel id="time_periods-label">Time Periods</InputLabel>
            <Select
              labelId="time_periods-label"
              id="Time Periods"
              value={time_periods}
              label="Time Periods"
              onChange={(e) => setTimePeriods(e.target.value)}
              displayEmpty
            >
              {/* Replace with your actual lighting conditions */}
              <MenuItem value="" style={{ fontStyle: 'italic', color: 'blue' }}> </MenuItem>
              <MenuItem value="early_morning">Early_Morning</MenuItem>
              <MenuItem value="morning">Morning</MenuItem>
              <MenuItem value="afternoon">Afternoon</MenuItem>
              <MenuItem value="evening">Evening</MenuItem>
              <MenuItem value="night">Night</MenuItem>
              {/* Add more MenuItem components as needed */}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" onClick={search} disabled={isLoading}>
            Search
          </Button>
        </Grid>
      </Grid>
      <h2>Results</h2>
      {/* <Button variant="contained" onClick={search} disabled={isLoading}>
      Search
    </Button> */}
    {isLoading && (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <CircularProgress />
      </div>
    )}
      <DataGrid
        rows={data}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={setPageSize}
        autoHeight
      />
    </Container>
  );
}