import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Button, Container, FormControl, Radio, RadioGroup, FormControlLabel, Grid, CircularProgress,
TextField} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import config from '../config.json';

export default function AlbumsPage() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedInfoType, setSelectedInfoType] = useState('collisions_basics');
  const [caseId, setCaseId] = useState('');
  const [columns, setColumns] = useState([]);
  const [pageSize, setPageSize] = useState(10);

  const tableColumns = useMemo(()=>({
    'collisions_basics': [
      { field: 'case_id', headerName: 'Case ID', width: 130 },
      { field: 'collision_timestamp', headerName: 'Time', width: 200 },
      { field: 'killed_victims', headerName: 'Killed Victims', width: 130 },
      { field: 'injured_victims', headerName: 'Injured Victims', width: 130 },
      { field: 'party_count', headerName: 'Party Count', width: 130 },
      // ... other fields for collisions_basics
    ],
    'collisions_location': [
      { field: 'case_id', headerName: 'Case ID', width: 130 },
      { field: 'county_location', headerName: 'County Location', width: 130 },
      { field: 'latitude', headerName: 'Latitude', width: 130 },
      { field: 'longitude', headerName: 'Longitude', width: 130 },
      // ... other fields for collisions_location
    ],
    'collisions_environment': [
      { field: 'case_id', headerName: 'Case ID', width: 180 },
      { field: 'weather_1', headerName: 'Primary Weather', width: 180 },
      { field: 'road_surface', headerName: 'Road Surface', width: 180 },
      { field: 'road_condition_1', headerName: 'Primary Road Condition', width: 180 },
      { field: 'lighting', headerName: 'Lighting', width: 180 },      
      // ... other fields for collisions_location
    ],
    'collisions_details': [
      { field: 'case_id', headerName: 'Case ID', width: 200 },
      { field: 'primary_collision_factor', headerName: 'Primary Collision Factor', width: 200 },
      { field: 'type_of_collision', headerName: 'Type of Collision', width: 200 },
      { field: 'motor_vehicle_involved_with', headerName: 'Involved With', width: 200 },
      { field: 'pedestrian_action', headerName: 'Pedestrian Action', width: 200 },
      { field: 'alcohol_involved', headerName: 'Alcohol Involved', width: 200 },
      { field: 'pedestrian_killed_count', headerName: 'Ped Killed Count', width: 200 },
      { field: 'pedestrian_injured_count', headerName: 'Ped Injured Count', width: 200 },
      { field: 'bicyclist_killed_count', headerName: 'Bicyclist Killed Count', width: 200 },
      { field: 'bicyclist_injured_count', headerName: 'Bicyclist Injured Count', width: 200 },
      { field: 'motorcyclist_killed_count', headerName: 'Motorcyclist Killed Count', width: 200 },
      { field: 'motorcyclist_injured_count', headerName: 'Motorcyclist Injured Count', width: 200 },
    ],
  }), []);

  const search = () => {
    if (!caseId) {
      alert('Please enter a case ID.');
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    const url = `http://${config.server_host}:${config.server_port}/${selectedInfoType}/${caseId}`;

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(responseData => {
        // If the response is an object, wrap it in an array and assign an id
        // The id could be the case_id, or you could generate one
        setData([{
          ...responseData,
          id: responseData.case_id, // Use case_id as a unique id for DataGrid rows
        }]);
      })      
      .catch(error => {
        console.error("Fetching error:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  

  useEffect(() => {
    setColumns(tableColumns[selectedInfoType]);
  }, [selectedInfoType, tableColumns]);

  return (
    <Container>
      <h2>Search Conditions</h2>
      <TextField
        label="Case ID"
        value={caseId}
        onChange={(e) => setCaseId(e.target.value)}
        margin="normal"
        fullWidth
      />
      <FormControl component="fieldset" margin="normal">
        <RadioGroup
          row
          aria-label="collision-info-type"
          name="collision-info-type"
          value={selectedInfoType}
          onChange={(e) => setSelectedInfoType(e.target.value)}
        >
          <FormControlLabel value="collisions_basics" control={<Radio />} label="Basics" />
          <FormControlLabel value="collisions_location" control={<Radio />} label="Location" />
          <FormControlLabel value="collisions_environment" control={<Radio />} label="Environment" />
          <FormControlLabel value="collisions_details" control={<Radio />} label="Details" />
        </RadioGroup>
      </FormControl>
      <Button 
        variant="contained" 
        onClick={search} 
        disabled={isLoading || !caseId}
        color="primary"
      >
        SEARCH
      </Button>
      {isLoading && <CircularProgress />}
      <h2>Results</h2>
      <DataGrid
        rows={data}
        columns={columns}
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight
      />
    </Container>
  );
}