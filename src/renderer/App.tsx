/* eslint-disable prettier/prettier */
import { MemoryRouter as Router, Routes, Route, Link } from 'react-router-dom';

import './App.css';
import './dist/output.css';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Register from './components/register';
import Search from './components/search';
import IRANSansWeb from './../../assets/fonts/IRANSansWeb.woff2';
import sepahImage from './../../assets/sepah.png';

function Main() {
  return (
    <div className="h-screen bg-yellow-300">
      <div className="h-fit bg-yellow-300">
        <div className="flex flex-col p-4  justify-between h-screen">
          <div className='flex justify-center items-center h-full box-border p-10'>
            <img className='object-contain w-1/3 rounded-full shadow-2xl' src="https://navideshahed.com/files/fa/news/1398/8/26/452178_963.jpg" alt="" />
          <img
              src={sepahImage}
              alt=""
              className="object-contain w-1/3"
            />
            <img
            src="https://cdn.eghtesadnews.com/thumbnail/IiPKnTRCDCMl/mW4TY_vzMeEG1fqb61-mcCKrGYGcOSm4SW9Yyhl5b2N1qvFeEPKLcFkzrdrrAcG9cg9gAf9kJWJmze2Es8GZhDlkJqwVKQrtPzxEA1UNWUA,/fi7LR8LxLPGN.jpg"
             alt="" className="object-contain w-1/3 rounded-full shadow-2xl" />

          </div>
          <div className="flex flex-col gap-2  rounded-2xl">
            <div className="flex justify-center font-bold text-4xl bg-green-900 text-yellow-500 p-8 rounded-xl">
              پایگاه مقاومت بسیج شهید مهدی نریمی
            </div>
            <div className=" flex gap-2">
              <div className="w-1/2 bg-amber-700 rounded-2xl">
                <Link
                  to="/search"
                  className="w-full text-white flex justify-center p-4 items-center hover:bg-slate-200 font-bold text-2xl"
                >
                  جستجو در اطلاعات ثبت شده
                </Link>
              </div>
              <div className="w-1/2  bg-blue-500 rounded-2xl">
                <Link
                  to="/register"
                  className="w-full text-white flex justify-center p-4 items-center hover:bg-slate-200 font-bold text-2xl"
                >
                  ثبت اطلاعات جدید
                </Link>
              </div>
            </div>
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
