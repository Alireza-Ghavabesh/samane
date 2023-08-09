/* eslint-disable prettier/prettier */
import { MemoryRouter as Router, Routes, Route, Link } from 'react-router-dom';

import './App.css';
import './dist/output.css';
import Register from './components/register';
import Search from './components/search';

function Main() {
  return (
    <div className="flex flex-row justify-around bg-blue-400 py-4 text-4xl items-center">
      <Link to="/search">جستجو</Link>
      <Link to="/register">ثبت</Link>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/register" element={<Register />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </Router>
  );
}
