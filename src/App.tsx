import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { UserProvider, useUser } from './contexts/UserContext';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import Home from './pages/Home';
import SketchToUI from './pages/SketchToUI';

import { TooltipProvider } from './components/ui/tooltip';

const AppRoutes = () => {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-zinc-50 dark:bg-[#09090B]">
        <div className="w-8 h-8 border-4 border-zinc-900 dark:border-white/[0.1] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={user ? <Home /> : <Navigate to="/auth" />} />
      <Route path="/auth" element={!user ? <Auth /> : <Navigate to="/" />} />
      <Route path="/profile" element={user ? <Profile /> : <Navigate to="/auth" />} />
      <Route path="/sketch" element={user ? <SketchToUI /> : <Navigate to="/auth" />} />
    </Routes>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <TooltipProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </UserProvider>
    </ThemeProvider>
  );
}
