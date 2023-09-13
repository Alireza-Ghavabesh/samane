/* eslint-disable prettier/prettier */
import { MemoryRouter as Router, Routes, Route, Link } from 'react-router-dom';

import './App.css';
import './dist/output.css';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Register from './components/register';
import Search from './components/search';
import IRANSansWeb from '../../assets/fonts/IRANSansWeb.woff2';
import sepahImage from '../../assets/sepah.png';
import sardar_soleymani from './../../assets/soleimani.jpg';
import sardar_narimi from './../../assets/narimi.jpg';

function Main() {
  return (
    <div className="flex flex-col justify-between h-screen p-4 bg-yellow-300">
      <div className="flex justify-center items-center p-6">
        <img id="img-1" className="" src={sardar_narimi} alt="" />
        <img id="img-2" src={sepahImage} alt="" className="" />
        <img id="img-3" src={sardar_soleymani} alt="" className="rounded-2xl" />
      </div>
      <div className="flex flex-col gap-2  rounded-2xl">
        <div className="flex justify-center font-bold text-4xl bg-green-900 text-yellow-500 p-8 rounded-xl ">
          پایگاه مقاومت بسیج شهید مهدی نریمی
        </div>
        <div className=" flex gap-2">
          <div className="w-1/2 bg-amber-700 rounded-2xl">
            <Link
              to="/search"
              className="w-full text-white flex justify-center p-4 items-center hover:bg-slate-200 font-bold text-2xl outline-none"
            >
              جستجو در اطلاعات ثبت شده
            </Link>
          </div>
          <div className="w-1/2  bg-blue-500 rounded-2xl">
            <Link
              to="/register"
              className="w-full text-white flex justify-center p-4 items-center hover:bg-slate-200 font-bold text-2xl outline-none"
            >
              ثبت اطلاعات جدید
            </Link>
          </div>
        </div>
      </div>
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

// optional configuration

export default function App() {
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <ThemeProvider theme={theme}>
      <ToastContainer />
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
