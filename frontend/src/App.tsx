import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Recommendations from './pages/Recommendations';
import Favorites from './pages/Favorites';
import Watched from './pages/Watched';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import { useAuthStore } from './store/authStore';
import { useEffect } from 'react';

function App() {
  const { initialize, isAuthenticated } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <Box minH="100vh">
      <Navigation />
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <Register />} />
        <Route path="/" element={!isAuthenticated ? <Navigate to="/login" /> : <Home />} />
        <Route path="/recommendations" element={!isAuthenticated ? <Navigate to="/login" /> : <Recommendations />} />
        <Route path="/favorites" element={!isAuthenticated ? <Navigate to="/login" /> : <Favorites />} />
        <Route path="/watched" element={!isAuthenticated ? <Navigate to="/login" /> : <Watched />} />
        <Route path="/profile" element={!isAuthenticated ? <Navigate to="/login" /> : <Profile />} />
      </Routes>
    </Box>
  );
}

export default App;