import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import DataEncryptionPage from './components/DataEncryptionPage';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/encrypt"
          element={
            <PrivateRoute>
              <DataEncryptionPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;