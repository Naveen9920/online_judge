import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ProblemsPage from './components/ProblemsPage';
import CompetitionsPage from './components/CompetitionsPage';
import Compiler from './components/Compiler';
import './App.css'; // Make sure your global styles are imported

// BeforePage Component
const BeforePage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-blue-50">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Welcome to Code-Veen</h1>
      <p className="text-xl text-gray-600 mb-6">
        Start solving coding problems and join coding competitions
      </p>

      {/* Register and Login buttons */}
      <div className="flex gap-4">
        <Link
          to="/register"
          className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
        >
          Register
        </Link>
        <Link
          to="/login"
          className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
        >
          Login
        </Link>
      </div>
    </div>
  );
};

const App = () => {
  const location = useLocation();

  // Show Register and Login links only on the homepage
  const isHomePage = location.pathname === '/';

  return (
    <div className="App">
      {/* Show the BeforePage only on the home page */}
      {isHomePage && <BeforePage />}

      {/* Define routes for other pages */}
      <Routes>
        <Route path="/" element={<BeforePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/problems" element={<ProblemsPage />} />
        <Route path="/competitions" element={<CompetitionsPage />} />
        <Route path="/compiler" element={<Compiler />} />
      </Routes>
    </div>
  );
};

// Wrapping App component with Router
const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
