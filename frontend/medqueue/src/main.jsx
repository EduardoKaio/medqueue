import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // ou seu CSS global
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    background: {
      default: '#f4f6f8',
    },
  },
  components: {
  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        backgroundColor: '#ffffff',
      },
    },
  },
},
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
