import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from '@mui/material'
import { red, grey } from '@mui/material/colors' // Changed to colors more suitable for the theme
import { createTheme } from "@mui/material/styles";
import React, {useState} from "react";




import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import BasicsPage from './pages/BasicsPage';
import AdvancedPage from './pages/AdvancedPage';
import AnalysisPage from './pages/AnalysisPage';
import CollisionsTimePage from "./pages/CollisionsTimePage";  
import CollisionPage from "./pages/CollisionPage";  // Updated import





// Create a theme with colors that may be more suitable for a traffic collision theme:
// red for danger and grey for neutrality and professionalism
export const theme = createTheme({
  palette: {
    primary: red,     // Red can signify alert or caution
    secondary: grey,  // Grey for neutral tones
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* This helps to maintain consistent baseline styles */}
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/basics" element={<BasicsPage />} />
          <Route path="/advanced" element={<AdvancedPage />} />
          <Route path="/analysis" element={<AnalysisPage />} />
          <Route path="/collisionstime" element={<CollisionsTimePage/>} />
          <Route path="/collision" element={<CollisionPage />} />  // Updated route

        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

