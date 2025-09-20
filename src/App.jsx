import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register'; 
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import AddProduct from './pages/AddProduct'; 
import EditProduct from './pages/EditProduct';
import AdminDashboard from './pages/AdminDashboard'; 



const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} /> {/* Nova rota de registro */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/add-product"
          element={
            <PrivateRoute>
              <AddProduct />
            </PrivateRoute>
          }
        />

        <Route
          path="/edit-product/:id"
          element={
            <PrivateRoute>
              <EditProduct />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        
      </Routes>
    </BrowserRouter>
  );
};

export default App;