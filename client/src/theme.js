import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#b71c1c', // Red for danger (you can adjust the shade)
    },
    secondary: {
      main: '#ffeb3b', // Yellow for caution (you can adjust the shade)
    },
    // Add custom colors and adjust as necessary
  },
  // Add other theme customizations here
});

export default theme;
