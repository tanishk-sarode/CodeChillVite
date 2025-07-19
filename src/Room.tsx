import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import socket from './socketClient';
import Editor from './Editor';
import type { User } from './types';
import './App.css';

interface ChatMessage {
  user: string;
  text: string;
  time: string;
}

const Room: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [username] = useState(() => {
    const savedUsername = localStorage.getItem('username');
    if (savedUsername) return savedUsername;
    const newUsername = prompt('Enter your name') || 'Guest';
    localStorage.setItem('username', newUsername);
    return newUsername;
  });
  const [activeUsers, setActiveUsers] = useState<User[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [copyFeedback, setCopyFeedback] = useState('');
  const [theme, setTheme] = useState<'dark' | 'light'>(
    localStorage.getItem('theme') === 'light' ? 'light' : 'dark'
  );
  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [showAbout, setShowAbout] = useState(false);

  // Get host name for this room from localStorage
  const hostName = roomId ? localStorage.getItem(`host_${roomId}`) : null;

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    if (!roomId) return;

    // Connect to room
    socket.emit('join-room', { roomId, username });
    setIsConnected(true);

    // Listen for active users updates
    socket.on('active-users', (users: User[]) => {
      setActiveUsers(users);
    });

    // Listen for connection status
    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    // Listen for chat messages
    socket.on('chat-message', (msg: ChatMessage) => {
      console.log('Received chat message:', msg);
      setChatMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.emit('leave-room', { roomId, username });
      socket.off('active-users');
      socket.off('connect');
      socket.off('disconnect');
      socket.off('chat-message');
    };
  }, [roomId, username]);

  useEffect(() => {
    // Scroll chat to bottom on new message
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  const leaveRoom = () => {
    socket.emit('leave-room', { roomId, username });
    navigate('/');
  };

  const handleCopyRoomCode = async () => {
    if (roomId) {
      await navigator.clipboard.writeText(roomId);
      setCopyFeedback('Copied!');
      setTimeout(() => setCopyFeedback(''), 1500);
    }
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const msg: ChatMessage = {
      user: username,
      text: chatInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    console.log('Sending chat message:', { roomId, ...msg });
    socket.emit('chat-message', { roomId, ...msg });
    setChatMessages((prev) => [...prev, msg]);
    setChatInput('');
  };

  if (!roomId) {
    return <div>Invalid room ID</div>;
  }

  return (
    <div className="ide-container">
      <div className="top-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <h1>CodeChill - Room</h1>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            fontSize: '14px'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: isConnected ? '#4CAF50' : '#f44336'
            }}></div>
            <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
          </div>
        </div>
        
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
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            fontSize: '14px'
          }}>
            <span>Room: {roomId.slice(0, 8)}...</span>
            {/* User count badge */}
            <span style={{
              display: 'inline-block',
              minWidth: '22px',
              padding: '2px 8px',
              borderRadius: '12px',
              background: '#2196F3',
              color: '#fff',
              fontWeight: 700,
              fontSize: '13px',
              textAlign: 'center',
              marginLeft: '4px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
            }} title="Active users in room">
              {activeUsers.length}
            </span>
            <button
              onClick={handleCopyRoomCode}
              style={{
                padding: '2px 8px',
                fontSize: '12px',
                borderRadius: '3px',
                border: '1px solid #2196F3',
                background: '#2196F3',
                color: 'white',
                cursor: 'pointer',
                marginLeft: '4px',
                position: 'relative'
              }}
              title="Copy Room Code"
            >
              Copy
            </button>
            {copyFeedback && (
              <span style={{ color: '#4CAF50', marginLeft: '4px', fontWeight: 500 }}>{copyFeedback}</span>
            )}
          </div>
          <button 
            onClick={leaveRoom}
            style={{ 
              padding: '8px 16px', 
              borderRadius: '4px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Leave Room
          </button>
        </div>
      </div>

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

      <div className="ide-body">
        <div className="editor-wrapper" style={{ flex: 1, minWidth: 0 }}>
          <Editor roomId={roomId} />
        </div>

        {/* Collapsible Sidebar */}
        <div style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'row',
        }}>
          {sidebarOpen && (
            <div className="output-wrapper" style={{ 
              flex: '0 0 250px', 
              maxWidth: '250px',
              padding: '1rem',
              borderLeft: '1px solid #333',
              backgroundColor: 'var(--bg-color)',
              overflowY: 'auto',
              transition: 'max-width 0.2s',
              minWidth: '200px',
              display: 'flex',
              flexDirection: 'column',
              height: '100%'
            }}>
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  marginBottom: '0.5rem',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}>
                  <span>👥 Users ({activeUsers.length})</span>
                </div>
                <div style={{ 
                  maxHeight: '120px',
                  overflowY: 'auto',
                  fontSize: '13px'
                }}>
                  {activeUsers.length === 0 ? (
                    <p style={{ color: '#666', fontStyle: 'italic', margin: 0 }}>No users connected</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      {activeUsers.map((user) => (
                        <div key={user.id} style={{
                          padding: '0.25rem 0.5rem',
                          backgroundColor: 'var(--code-bg)',
                          borderRadius: '3px',
                          border: '1px solid #333',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          fontSize: '12px'
                        }}>
                          <div style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            backgroundColor: '#4CAF50'
                          }}></div>
                          <span>{user.username}</span>
                          {hostName && user.username === hostName && (
                            <span style={{ 
                              fontSize: '10px', 
                              color: '#2196F3',
                              fontWeight: 700,
                              marginLeft: '4px',
                              fontStyle: 'italic'
                            }}>Host</span>
                          )}
                          {user.username === username && (
                            <span style={{ 
                              fontSize: '10px', 
                              color: '#666',
                              fontStyle: 'italic',
                              marginLeft: '4px'
                            }}>(You)</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ 
                padding: '0.75rem',
                backgroundColor: 'var(--code-bg)',
                borderRadius: '4px',
                border: '1px solid #333',
                fontSize: '12px',
                marginBottom: '1rem'
              }}>
                <div style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>📋 Room Info</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <strong>ID:</strong> {roomId.slice(0, 8)}...
                    <button
                      onClick={handleCopyRoomCode}
                      style={{
                        padding: '1px 6px',
                        fontSize: '11px',
                        borderRadius: '3px',
                        border: '1px solid #2196F3',
                        background: '#2196F3',
                        color: 'white',
                        cursor: 'pointer',
                        marginLeft: '4px',
                        position: 'relative'
                      }}
                      title="Copy Room Code"
                    >
                      Copy
                    </button>
                    {copyFeedback && (
                      <span style={{ color: '#4CAF50', marginLeft: '4px', fontWeight: 500 }}>{copyFeedback}</span>
                    )}
                  </div>
                  <div><strong>Name:</strong> {username}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <strong>Status:</strong>
                    <div style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: isConnected ? '#4CAF50' : '#f44336'
                    }}></div>
                    <span>{isConnected ? 'Online' : 'Offline'}</span>
                  </div>
                </div>
              </div>

              {/* Chat Panel */}
              <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                minHeight: 0,
                background: 'var(--code-bg)',
                borderRadius: '4px',
                border: '1px solid #333',
                padding: '0.5rem',
                marginBottom: '0.5rem',
                maxHeight: '220px',
                overflow: 'hidden'
              }}>
                <div style={{ fontWeight: 'bold', marginBottom: '0.25rem', fontSize: '13px' }}>💬 Chat</div>
                <div style={{
                  flex: 1,
                  overflowY: 'auto',
                  background: 'transparent',
                  marginBottom: '0.5rem',
                  paddingRight: '2px',
                  minHeight: 0
                }}>
                  {chatMessages.length === 0 ? (
                    <div style={{ color: 'var(--text-color)', opacity: 0.6, fontStyle: 'italic', fontSize: '12px' }}>No messages yet.</div>
                  ) : (
                    chatMessages.map((msg, idx) => (
                      <div key={idx} style={{ marginBottom: '0.25rem', fontSize: '12px', wordBreak: 'break-word' }}>
                        <span style={{ fontWeight: msg.user === username ? 700 : 500, color: msg.user === username ? '#2196F3' : 'var(--text-color)' }}>{msg.user}</span>
                        <span style={{ color: 'var(--text-color)', opacity: 0.6, fontSize: '10px', marginLeft: '0.5em' }}>{msg.time}</span>
                        <div style={{ marginLeft: '0.5em', color: 'var(--text-color)' }}>{msg.text}</div>
                      </div>
                    ))
                  )}
                  <div ref={chatEndRef} />
                </div>
                <form onSubmit={handleSendChat} style={{ display: 'flex', gap: '0.25rem' }}>
                  <input
                    type="text"
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    placeholder="Type a message..."
                    style={{ flex: 1, padding: '4px 8px', borderRadius: '3px', border: '1px solid var(--border-color)', fontSize: '12px', background: 'var(--bg-color)', color: 'var(--text-color)' }}
                    maxLength={200}
                  />
                  <button
                    type="submit"
                    style={{ padding: '4px 10px', borderRadius: '3px', border: 'none', background: '#2196F3', color: '#fff', fontWeight: 600, fontSize: '12px', cursor: 'pointer' }}
                    disabled={!chatInput.trim()}
                  >
                    Send
                  </button>
                </form>
              </div>
            </div>
          )}
          {/* Collapse/Expand Button */}
          <button
            onClick={() => setSidebarOpen((open) => !open)}
            style={{
              position: 'absolute',
              left: sidebarOpen ? '-18px' : '-18px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 2,
              width: '24px',
              height: '40px',
              borderRadius: '0 6px 6px 0',
              border: '1px solid #333',
              background: '#222',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '18px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0
            }}
            title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {sidebarOpen ? '<' : '>'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Room;
