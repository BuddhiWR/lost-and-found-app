import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext';
import AddLostItem from './pages/AddLostItem';
import Home from './pages/Home';
import ProtectedRoute from './components/ProtectedRoute';
import AdminPanel from './pages/AdminPanel';


const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/add-item" element={<AddLostItem />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}/>
        <Route path="/admin-panel" element={<ProtectedRoute allowedRoles={['ADMIN', 'STAFF']}><AdminPanel /></ProtectedRoute>}/>

      </Routes>
       </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
