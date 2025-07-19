import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './index.css';
import './App.css';

export default function App() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const createRoom = () => {
    const id = uuidv4();
    navigate(`/room/${id}`);
  };

  return (
    <div className="ide-container">
      <div className="top-bar">
        <h1>CodeChill</h1>
        <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
      <div
        style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}
      >
        <button onClick={createRoom}>Create Room</button>
      </div>
    </div>
  );
}
