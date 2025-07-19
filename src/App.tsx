import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Editor from './Editor';
import { v4 as uuidv4 } from 'uuid';
import './App.css';

const App: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>(
    localStorage.getItem('theme') === 'light' ? 'light' : 'dark'
  );
  const [showCollabModal, setShowCollabModal] = useState(false);
  const [username, setUsername] = useState(() => localStorage.getItem('username') || '');
  const [roomId, setRoomId] = useState('');
  const [joinError, setJoinError] = useState('');
  const [showAbout, setShowAbout] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleCreateRoom = () => {
    const newRoomId = uuidv4();
    // Always set username to 'Host' for the creator
    localStorage.setItem('username', 'Host');
    localStorage.setItem(`host_${newRoomId}`, 'Host');
    navigate(`/room/${newRoomId}`);
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setJoinError('Please enter your name.');
      return;
    }
    if (username.trim().toLowerCase() === 'host') {
      setJoinError('You cannot use "Host" as your name.');
      return;
    }
    if (!roomId.trim()) {
      setJoinError('Please enter a room ID.');
      return;
    }
    setJoinError('');
    localStorage.setItem('username', username.trim());
    navigate(`/room/${roomId.trim()}`);
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);
    if (value.trim().toLowerCase() === 'host') {
      setJoinError('You cannot use "Host" as your name.');
    } else {
      setJoinError('');
    }
  };

  return (
    <div className="ide-container">
      <div className="top-bar">
        <h1>CodeChill</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            style={{ padding: '8px 16px', borderRadius: '4px', border: 'none', background: '#333', color: '#fff', cursor: 'pointer' }}
          >
            {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
          </button>
          <button
            onClick={() => setShowAbout(true)}
            style={{ padding: '8px 16px', borderRadius: '4px', border: 'none', background: '#2196F3', color: '#fff', cursor: 'pointer' }}
          >
            About
          </button>
          <button
            onClick={() => setShowCollabModal(true)}
            style={{ padding: '8px 16px', borderRadius: '4px', border: 'none', background: '#2196F3', color: '#fff', cursor: 'pointer' }}
          >
            Switch to Collaborative
          </button>
        </div>
      </div>

      {/* Collaborative Login Modal/Page */}
      {showCollabModal && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div className="modal-content" style={{
            background: 'var(--bg-color)',
            padding: '2rem 2.5rem',
            borderRadius: '10px',
            boxShadow: '0 4px 32px rgba(0,0,0,0.2)',
            minWidth: '320px',
            maxWidth: '90vw',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.5rem',
          }}>
            <h2 style={{ margin: 0 }}>Join a Collaborative Room</h2>
            <form onSubmit={handleJoinRoom} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <label style={{ fontWeight: 500 }}>
                Your Name
                <input
                  type="text"
                  value={username}
                  onChange={handleUsernameChange}
                  placeholder="Enter your name"
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #888', marginTop: '0.25rem' }}
                  autoFocus
                />
              </label>
              <label style={{ fontWeight: 500 }}>
                Room ID
                <input
                  type="text"
                  value={roomId}
                  onChange={e => setRoomId(e.target.value)}
                  placeholder="Enter room ID to join"
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #888', marginTop: '0.25rem' }}
                />
              </label>
              {joinError && <div style={{ color: '#f44336', fontWeight: 500 }}>{joinError}</div>}
              <button
                type="submit"
                style={{ padding: '10px 0', borderRadius: '4px', border: 'none', background: '#4CAF50', color: '#fff', fontWeight: 600, fontSize: '16px', cursor: joinError ? 'not-allowed' : 'pointer', opacity: joinError ? 0.6 : 1 }}
                disabled={!!joinError}
              >
                Join Room
              </button>
            </form>
            <div style={{ width: '100%', textAlign: 'center', margin: '0.5rem 0', color: '#888' }}>or</div>
            <button
              onClick={handleCreateRoom}
              style={{ padding: '10px 0', borderRadius: '4px', border: 'none', background: '#2196F3', color: '#fff', fontWeight: 600, fontSize: '16px', width: '100%', cursor: 'pointer' }}
            >
              Create Room
            </button>
            <button
              onClick={() => setShowCollabModal(false)}
              style={{ marginTop: '0.5rem', background: 'none', border: 'none', color: '#2196F3', cursor: 'pointer', fontSize: '15px', textDecoration: 'underline' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* About/Help Modal */}
      {showAbout && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.4)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            background: 'var(--bg)',
            color: 'var(--text)',
            borderRadius: '10px',
            padding: '2rem',
            maxWidth: '420px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
            border: '1px solid #2196F3',
            position: 'relative',
          }}>
            <h2 style={{ marginTop: 0 }}>About CodeChill</h2>
            <p><b>CodeChill</b> is a collaborative online code editor and runner, built as a simple student project.</p>
            <ul style={{ fontSize: '15px', margin: '1em 0 1em 1.2em', padding: 0 }}>
              <li>Supports C++, C, Python, Java, JavaScript</li>
              <li>Run code with custom input and see output instantly</li>
              <li>Collaborative rooms with real-time code, input, output, and chat sync</li>
              <li>Active users and host labeling</li>
              <li>Theme toggle (dark/light)</li>
              <li>Sidebar with chat, room info, and user list</li>
              <li>Copy room code, user count badge, and more</li>
              <li>Reset/Clear output, collaborative login modal, and more</li>
            </ul>
            <p style={{ fontSize: '14px', color: 'var(--text)', opacity: 0.8 }}>
              <b>How to use:</b><br/>
              - Use "Switch to Collaborative" on the home page to join or create a room.<br/>
              - Share the room code with friends to collaborate.<br/>
              - Use the chat panel to communicate.<br/>
              - Use the top bar to change theme, see user count, and access this help.<br/>
              - Use "Reset All" to clear code/input/output for everyone.<br/>
            </p>
            <button
              onClick={() => setShowAbout(false)}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: '#2196F3',
                color: '#fff',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                fontSize: '18px',
                cursor: 'pointer',
                fontWeight: 700
              }}
              title="Close"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Hide main UI when modal is open */}
      {!showCollabModal && (
        <div className="ide-body">
          <div className="editor-wrapper" style={{ flex: 1, minWidth: 0 }}>
            <Editor roomId="local" />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
