import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';

// Layout wrapper that conditionally shows Navbar/Footer
const AppLayout = () => {
  const location = useLocation();
  const isFullscreen =
    location.pathname === '/' ||
    location.pathname === '/dashboard' ||
    location.pathname === '/admin';

  return (
    <div className="flex flex-col min-h-screen font-sans">
      {!isFullscreen && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/"          element={<Home />} />
          <Route path="/login"     element={<Login />} />
          <Route path="/signup"    element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin"     element={<AdminDashboard />} />
        </Routes>
      </main>
      {!isFullscreen && <Footer />}
    </div>
  );
};

const App = () => (
  <Router>
    <AppLayout />
  </Router>
);

export default App;
