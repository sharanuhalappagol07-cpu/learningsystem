import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthGuard, PublicOnly } from './components/Auth/AuthGuard';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Home } from './pages/Home';
import { SubjectOverview } from './pages/SubjectOverview';
import { VideoPage } from './pages/VideoPage';
import { Profile } from './pages/Profile';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <PublicOnly>
            <Login />
          </PublicOnly>
        }
      />
      <Route
        path="/register"
        element={
          <PublicOnly>
            <Register />
          </PublicOnly>
        }
      />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <AuthGuard>
            <Home />
          </AuthGuard>
        }
      />
      <Route
        path="/profile"
        element={
          <AuthGuard>
            <Profile />
          </AuthGuard>
        }
      />
      <Route
        path="/subjects/:subjectId"
        element={
          <AuthGuard>
            <SubjectOverview />
          </AuthGuard>
        }
      />
      <Route
        path="/subjects/:subjectId/video/:videoId"
        element={
          <AuthGuard>
            <VideoPage />
          </AuthGuard>
        }
      />
    </Routes>
  );
}

export default App;
