import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import EmployeeForm from './components/EmployeeForm';
import EmployeeSearch from './components/EmployeeSearch';
import UpdateEmployee from './components/UpdateEmployee';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Navigation() {
  const location = useLocation();  
  return (
    <nav style={{
      display: 'flex',
      gap: '1em',
      marginBottom: '2em',
      background: 'rgba(255, 255, 255, 0.9)',
      padding: '1em 2em',
      borderRadius: '10px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }}>
      <Link 
        to="/" 
        style={{
          padding: '0.5em 1.5em',
          textDecoration: 'none',
          borderRadius: '5px',
          fontWeight: 600,
          background: location.pathname === '/' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
          color: location.pathname === '/' ? 'white' : '#333',
          border: location.pathname === '/' ? 'none' : '2px solid #667eea',
          transition: 'all 0.3s ease'
        }}
      >
        Add Employee
      </Link>
      <Link 
        to="/search" 
        style={{
          padding: '0.5em 1.5em',
          textDecoration: 'none',
          borderRadius: '5px',
          fontWeight: 600,
          background: location.pathname === '/search' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
          color: location.pathname === '/search' ? 'white' : '#333',
          border: location.pathname === '/search' ? 'none' : '2px solid #667eea',
          transition: 'all 0.3s ease'
        }}
      >
        View Employees
      </Link>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div style={{
        minHeight: '100vh',
        width: '100vw',
        overflowX: 'hidden',
        background: 'linear-gradient(90deg,#dae2f8 0%,#d6a4a4 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2em'
      }}>
        <h1 style={{
          margin: '1em 0',
          color: '#234',
          fontWeight: 700,
          textAlign: 'center'
        }}>
          Employee Management Portal
        </h1>

        <Navigation />

        <Routes>
          <Route path="/" element={<EmployeeForm />} />
          <Route path="/search" element={<EmployeeSearch />} />
          <Route path="/edit-employee/:empId" element={<UpdateEmployee />} />
        </Routes>

        <ToastContainer position="bottom-center" autoClose={2800} newestOnTop />
      </div>
    </Router>
  );
}

export default App;
