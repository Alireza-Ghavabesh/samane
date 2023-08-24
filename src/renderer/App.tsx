/* eslint-disable prettier/prettier */
import { MemoryRouter as Router, Routes, Route, Link } from 'react-router-dom';

import './App.css';
import './dist/output.css';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Register from './components/register';
import Search from './components/search';
import IRANSansWeb from './../../assets/fonts/IRANSansWeb.woff2';

function Main() {
  return (
    <div className="flex flex-row justify-around bg-blue-400 py-4 text-4xl items-center">
      <Link to="/search">جستجو</Link>
      <Link to="/register">ثبت</Link>
    </div>
  );
}

const theme = createTheme({
  typography: {
    fontFamily: 'IRANSansWeb',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: 'IRANSansWeb';
          src: local('IRANSansWeb'), local('IRANSansWeb'), url(${IRANSansWeb}) format('woff2');
        }
      `,
    },
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/register" element={<Register />} />
          <Route path="/search" element={<Search />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
