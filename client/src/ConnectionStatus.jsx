import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

// Adres serwera backendowego (odpalonego przez Filipa w WSL)
const URL = 'http://localhost:3000';

export default function ConnectionStatus() {
  const [isConnected, setIsConnected] = useState(false);
  const [socketId, setSocketId] = useState(null);

  useEffect(() => {
    // Nawiązanie połączenia z serwerem
    const socket = io(URL);

    // Nasłuchiwanie na udane połączenie
    socket.on('connect', () => {
      setIsConnected(true);
      setSocketId(socket.id);
      console.log('✅ Połączono z serwerem Dixit AI');
    });

    // Nasłuchiwanie na utratę połączenia
    socket.on('disconnect', () => {
      setIsConnected(false);
      setSocketId(null);
      console.log('❌ Rozłączono z serwerem');
    });

    // Nasłuchiwanie na błędy (przydatne do debugowania)
    socket.on('connect_error', (err) => {
      console.error('⚠️ Błąd połączenia:', err.message);
    });

    // Funkcja czyszcząca (BARDZO WAŻNE W REACT!)
    // Zapobiega tworzeniu setek połączeń, gdy React odświeża komponent (np. w StrictMode)
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
      socket.disconnect();
    };
  }, []); // Pusta tablica oznacza, że uruchomi się to tylko raz po załadowaniu komponentu

  // Proste style liniowe, żeby wizualnie oddzielić status
  const statusStyle = {
    padding: '10px 20px',
    borderRadius: '8px',
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: isConnected ? '#10b981' : '#ef4444', // Zielony (LIVE) / Czerwony (OFFLINE)
    display: 'inline-block',
    margin: '20px',
    fontFamily: 'sans-serif'
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Test Połączenia z Backendem</h2>
      <div style={statusStyle}>
        {isConnected ? '🟢 STATUS: LIVE' : '🔴 STATUS: OFFLINE'}
      </div>
      {isConnected && (
        <p style={{ color: '#666' }}>ID Gniazda (Socket ID): {socketId}</p>
      )}
    </div>
  );
}