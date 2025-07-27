import { useEffect, useState } from 'react';
import { Container, Divider, Link } from '@mui/material';
import { NavLink } from 'react-router-dom';

import LazyTable from '../components/LazyTable';
const config = require('../config.json');

export default function HomePage() {
  // We use the setState hook to persist information across renders (such as the result of our API calls)
  const [caseOfTheDay, setCaseOfTheDay] = useState({});
  // TODO (TASK 13): add a state variable to store the app author (default to '')
  const [appAuthor, setAppAuthor] = useState('');
  const [selectedCaseId, setSelectedCaseId] = useState(null);

  // The useEffect hook by default runs the provided callback after every render
  // The second (optional) argument, [], is the dependency array which signals
  // to the hook to only run the provided callback if the value of the dependency array
  // changes from the previous render. In this case, an empty array means the callback
  // will only run on the very first render.
  useEffect(() => {
    // Fetch request to get the song of the day. Fetch runs asynchronously.
    // The .then() method is called when the fetch request is complete
    // and proceeds to convert the result to a JSON which is finally placed in state.
    fetch(`http://${config.server_host}:${config.server_port}/random`)
      .then(res => res.json())
      .then(resJson => setCaseOfTheDay(resJson));

    // TODO (TASK 14): add a fetch call to get the app author (name not pennkey) and 
    // store the name field in the state variable
    fetch(`http://${config.server_host}:${config.server_port}/author/name`)
    .then(res => res.json())
    .then(data => setAppAuthor(data.name));
  }, []);

  const songColumns = [
    {
      field: 'case_id',
      headerName: 'CaseID',
      //renderCell: (row) => <Link onClick={() => setSelectedCaseId(row.case_id)}>{row.case_id}</Link> // A Link component is used just for formatting purposes
    },
    {
      field: 'collision_timestamp',
      headerName: 'Time',
    },
    {
      field: 'num_of_killed_injured',
      headerName: 'Number of Killed or Injured'
    },
  ];

  // TODO (TASK 15): define the columns for the top albums (schema is Album Title, Plays), where Album Title is a link to the album page
  // Hint: this should be very similar to songColumns defined above, but has 2 columns instead of 3
  // Hint: recall the schema for an album is different from that of a song (see the API docs for /top_albums). How does that impact the "field" parameter and the "renderCell" function for the album title column?
  const albumColumns = [
   
    {
      field: 'year',
      headerName: 'Year'
    },
    {
      field: 'month',
      headerName: 'Month'
    },
    {
      field: 'time_period',
      headerName: 'Time Period'
    },
    {
      field: 'total_cases',
      headerName: 'Total Cases'
    }
  ]

  return (
    <Container>
      <h2 style={{
        fontSize: '36px', // Increase font size
        fontFamily: '"Lucida Console", "Courier New", monospace', // Example of a more decorative font
        color: 'red' // Change color to red
      }}>
        Hey, bro! Thousands of roads, safety first!
      </h2>
      < img src="/lambo_crash.png" alt="Lamborghini Crash Scene" style={{ width: '100%', marginBottom: '1rem' }} />
      {/* SongCard is a custom component that we made. selectedSongId && <SongCard .../> 
      makes use of short-circuit logic to only render the SongCard if a non-null song is selected */}
      
      <h2>Check out case in the same day in the past:  
        <span style={{ fontWeight: 'bold' }}>{caseOfTheDay.case_id}</span>
      </h2>

      <Divider />
      <h2>Top Killed And Injured Cases</h2>
      <LazyTable route={`http://${config.server_host}:${config.server_port}/top_killed_injured`} columns={songColumns} />
      <Divider />
      {/* TODO (TASK 17): add a paragraph (<p></p>) that displays “Created by [name]” using the name state stored from TASK 13/TASK 14 */}
      <p>Created by {appAuthor}</p>
    </Container>
  );
};