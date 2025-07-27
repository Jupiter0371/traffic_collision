import { useEffect, useState } from 'react';
import { Button, Container, FormControl, InputLabel, MenuItem, Select, Grid, TextField, CircularProgress } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import config from '../config.json'; 



export default function CollisionTypePage() {
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);
  const [collisionType, setCollisionType] = useState('Other');
  const [partyNumber, setPartyNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(false);


  const search = async () => {
    setIsLoading(true);  // Indicate the start of the fetch operation
  
    fetch(`http://${config.server_host}:${config.server_port}/party_number_collision_type/${collisionType}/${partyNumber}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        collisionType: collisionType ? [collisionType] : [],
        partyNumber: partyNumber ? [partyNumber] : [],
        //collisionType: collisionType,
        // partyNumber: partyNumber,
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
  


  const columns = [
    {
      field: 'case_id',
      headerName: 'Case ID',
      width: 100,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'collision_timestamp',
      headerName: 'Timestamp',
      width: 180,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'lighting',
      headerName: 'Lighting Conditions',
      width: 180,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'road_condition_1',
      headerName: 'Road Condition',
      width: 150,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'road_surface',
      headerName: 'Road Surface',
      width: 120,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'injured_victims',
      headerName: 'Injured Victims',
      width: 130,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'killed_victims',
      headerName: 'Fatalities',
      width: 100,
      headerAlign: 'center',
      align: 'center',
    }
  ];
  
  


  return (
    <Container>
      <h2>Let's Explore Types of Collision and Party Number</h2>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="collision-type-label">Type of Collision</InputLabel>
            <Select
              labelId="collision-type-label"
              id="collision-type"
              value={collisionType}
              label="Type of Collision"
              onChange={(e) => setCollisionType(e.target.value)}
              displayEmpty
            >
              <MenuItem value="" style={{ fontStyle: 'italic', color: 'gray' }}>Select Type</MenuItem>
              <MenuItem value="Rear-End">Rear-End</MenuItem>
              <MenuItem value="Hit Object">Hit Object</MenuItem>
              <MenuItem value="Sideswipe">Sideswipe</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
              <MenuItem value="Broadside">Broadside</MenuItem>
              <MenuItem value="Head-On">Head-On</MenuItem>
              <MenuItem value="Pedestrian">Pedestrian</MenuItem>
              <MenuItem value="Overturned">Overturned</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="party-number-label">Party Number</InputLabel>
            <Select
              labelId="party-number-label"
              id="party-number"
              value={partyNumber}
              label="Party Number"
              onChange={(e) => setPartyNumber(parseInt(e.target.value))}
              displayEmpty
            >
              <MenuItem value="" style={{ fontStyle: 'italic', color: 'gray' }}>Select Number</MenuItem>
              {[...Array(16)].map((x, i) => (
                <MenuItem key={i+1} value={i+1}>{i+1}</MenuItem>
              ))}
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
