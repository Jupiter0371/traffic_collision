import { useEffect, useState } from 'react';
import { Button, Container, FormControl, InputLabel, MenuItem, Select, Grid, TextField, CircularProgress } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import config from '../config.json'; 

export default function AdvancedPage() {
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);
  const [weatherConditions, setWeatherConditions] = useState('');
  const [roadConditions, setRoadConditions] = useState('');
  const [lightingConditions, setLightingConditions] = useState('');
  const [isLoading, setIsLoading] = useState(false);


  const search = async () => {
    setIsLoading(true);  // Indicate the start of the fetch operation
  
    fetch(`http://${config.server_host}:${config.server_port}/generate-query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        weatherConditions: weatherConditions ? [weatherConditions] : [],
        roadConditions: roadConditions ? [roadConditions] : [],
        lightingConditions: lightingConditions ? [lightingConditions] : [],
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
      const dataWithIds = [resJson].map((item, index) => ({ ...item, id: index }));
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
      field: 'total_accidents',
      headerName: 'Total Accidents',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'avg_victims_per_accident',
      headerName: 'Average Victims',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      valueFormatter: ({ value }) => value.toFixed(2), // Assuming you want to format it to 4 decimal places
    },
    {
      field: 'proportion_with_alcohol',
      headerName: 'Alcohol Proportion',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      valueFormatter: ({ value }) => (value * 100).toFixed(2) + '%', // Assuming you want to show it as a percentage
    },
    {
      field: 'accidents_involving_young_drivers',
      headerName: 'Young Drivers Accidents',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'young_driver_accident_percentage',
      headerName: 'Young Driver Involved Portion',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      valueFormatter: ({ value }) => (value * 100).toFixed(2) + '%', // Assuming you want to show it as a percentage
    },
  ];
  
  


  return (
    <Container>
      <h2>Search Conditions</h2>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel id="weather-conditions-label">Weather Conditions</InputLabel>
            <Select
              labelId="weather-conditions-label"
              id="weather-conditions"
              value={weatherConditions}
              label="Weather Conditions"
              onChange={(e) => setWeatherConditions(e.target.value)}
              displayEmpty
            >
              {/* Replace with your actual weather conditions */}
              <MenuItem value="" style={{ fontStyle: 'italic', color: 'gray' }}> </MenuItem>
              <MenuItem value="clear">Clear</MenuItem>
              <MenuItem value="cloudy">Cloudy</MenuItem>              
              <MenuItem value="fog">Fog</MenuItem>
              <MenuItem value="raining">Raining</MenuItem>
              <MenuItem value="snowing">Snowing</MenuItem>
              <MenuItem value="wind">Wind</MenuItem>
              <MenuItem value="other">Other</MenuItem>
              {/* Add more MenuItem components as needed */}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel id="road-conditions-label">Road Conditions</InputLabel>
            <Select
              labelId="road-conditions-label"
              id="road-conditions"
              value={roadConditions}
              label="Road Conditions"
              onChange={(e) => setRoadConditions(e.target.value)}
              displayEmpty
            >
              {/* Replace with your actual road conditions */}
              <MenuItem value="" style={{ fontStyle: 'italic', color: 'gray' }}> </MenuItem>
              <MenuItem value="dry">Dry</MenuItem>              
              <MenuItem value="slippery">Slippery</MenuItem>
              <MenuItem value="snowy">Snowy</MenuItem>
              <MenuItem value="wet">Wet</MenuItem>
              {/* Add more MenuItem components as needed */}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel id="lighting-conditions-label">Lighting Conditions</InputLabel>
            <Select
              labelId="lighting-conditions-label"
              id="lighting-conditions"
              value={lightingConditions}
              label="Lighting Conditions"
              onChange={(e) => setLightingConditions(e.target.value)}
              displayEmpty
            >
              {/* Replace with your actual lighting conditions */}
              <MenuItem value="" style={{ fontStyle: 'italic', color: 'gray' }}> </MenuItem>
              <MenuItem value="daylight">Daylight</MenuItem>
              <MenuItem value="dark with street lights">Dark with street lights</MenuItem>
              <MenuItem value="dusk or dawn">Dusk or dawn</MenuItem>
              <MenuItem value="dark with no street lights">Dark with no street lights</MenuItem>
              <MenuItem value="dark with street lights not functioning">Dark with street lights not functioning</MenuItem>
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
        // rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={setPageSize}
        autoHeight
      />
    </Container>
  );
}
