import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import App from './App';
import Room from './Room';

const Root: React.FC = () => {
  const [theme, setTheme] = useState(
    () => localStorage.getItem('theme') || 'light'
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <Routes>
      <Route path="/" element={<App theme={theme} setTheme={setTheme} />} />
      <Route path="/room/:roomId" element={<Room />} />
    </Routes>
  );
};

export default Root; 