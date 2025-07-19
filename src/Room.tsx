import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import socket from './socket';
import Editor from './Editor';

const Room = () => {
  const { roomId } = useParams();
  const [username] = useState(() => prompt('Enter your name') || 'Guest');
  const [activeUsers, setActiveUsers] = useState([]);

  useEffect(() => {
    socket.emit('join-room', { roomId, username });

    socket.on('active-users', (users) => {
      setActiveUsers(users);
    });

    return () => {
      socket.emit('leave-room', { roomId, username });
      socket.off('active-users');
    };
  }, [roomId, username]);

  return (
    <div>
      <h1>Room ID: {roomId}</h1>
      <h3>Active Users:</h3>
      <ul>
        {activeUsers.map((user) => (
          <li key={user.id}>{user.username}</li>
        ))}
      </ul>

      <Editor roomId={roomId} />
    </div>
  );
};

export default Room;
