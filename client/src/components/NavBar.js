import React from 'react';
import { AppBar, Container, Toolbar, Typography, Box } from '@mui/material';
import { NavLink } from 'react-router-dom';

function NavText({ href, text, isMain }) {
  return (
    <Typography
      component="div"  // Use div to enable more flexible styling
      variant={isMain ? 'h3' : 'h6'}  // 'h3' for main to make it larger, 'h6' for others
      style={{
        marginRight: isMain ? '0px' : '20px',  // No margin on the right for the main text
        fontFamily: 'monospace',
        fontWeight: isMain ? 900 : 700,  // Bolder and larger for the main link
        letterSpacing: isMain ? '.3rem' : '.15rem',  // Slightly more spacing for the main link
        color: 'inherit',
        textDecoration: 'none',
        display: 'block',  // Display block to fill the flex container
        textAlign: 'center'  // Center text alignment
      }}
    >
      <NavLink
        to={href}
        style={{
          color: 'inherit',
          textDecoration: 'none',
          display: 'block',  // Ensure the NavLink fills the Typography block
        }}
      >
        {text}
      </NavLink>
    </Typography>
  );
}

export default function NavBar() {
  return (
    <AppBar position="static" color="primary">
    <Container maxWidth="xl">
      <Toolbar disableGutters sx={{ flexDirection: 'column', alignItems: 'center' }}>
        <Box sx={{ width: '100%', textAlign: 'center', marginBottom: '10px' }}>  
          <NavText href="/" text="California Highway Accidents" isMain />
        </Box>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',  // Changes here for spacing
          flexWrap: 'wrap', 
          width: '100%'  // Ensure the container uses full width
        }}>
          <NavText href="/basics" text="BASIC RESEARCH" />
          <NavText href="/advanced" text="ADVANCED" />
          <NavText href="/collisionstime" text="COLLISIONS TIME" />
          <NavText href="/analysis" text="ALCOHOL INVOLVED ANALYSIS" />
          <NavText href="/collision" text="COLLISIONS TYPE" />
        </Box>
      </Toolbar>
    </Container>
  </AppBar>
  );
  
}