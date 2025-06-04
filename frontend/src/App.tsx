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
import AdminUsers from './pages/admin/Users';
import AdminStats from './pages/admin/Stats';
import { useAuthStore } from './store/authStore';
import { useEffect } from 'react';

function App() {
  const { initialize, isAuthenticated, isAdmin } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <Box minH="100vh">
      <Navigation />
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <Register />} />
        
        {/* User Routes */}
        <Route path="/" element={!isAuthenticated ? <Navigate to="/login" /> : <Home />} />
        <Route 
          path="/recommendations" 
          element={!isAuthenticated ? <Navigate to="/login" /> : 
            isAdmin ? <Navigate to="/admin/stats" /> : <Recommendations />
          } 
        />
        <Route 
          path="/favorites" 
          element={!isAuthenticated ? <Navigate to="/login" /> : 
            isAdmin ? <Navigate to="/admin/stats" /> : <Favorites />
          } 
        />
        <Route 
          path="/watched" 
          element={!isAuthenticated ? <Navigate to="/login" /> : 
            isAdmin ? <Navigate to="/admin/stats" /> : <Watched />
          } 
        />
        
        {/* Admin Routes */}
        <Route 
          path="/admin/users" 
          element={!isAuthenticated ? <Navigate to="/login" /> : 
            !isAdmin ? <Navigate to="/" /> : <AdminUsers />
          } 
        />
        <Route 
          path="/admin/stats" 
          element={!isAuthenticated ? <Navigate to="/login" /> : 
            !isAdmin ? <Navigate to="/" /> : <AdminStats />
          } 
        />
        
        <Route path="/profile" element={!isAuthenticated ? <Navigate to="/login" /> : <Profile />} />
      </Routes>
    </Box>
  );
}

export default App;