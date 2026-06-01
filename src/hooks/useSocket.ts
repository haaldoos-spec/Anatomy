import { useEffect, useRef } from 'react';
import { socket } from '@/lib/socket';
import { useAuth } from '@/context/AuthContext';

export const useSocket = () => {
  const { user } = useAuth();
  const initialized = useRef(false);

  useEffect(() => {
    if (user && !initialized.current) {
      socket.connect();
      socket.emit('register', user.id);
      initialized.current = true;
      console.log('Socket connected and registered for user:', user.id);
    }

    return () => {
      if (initialized.current) {
        socket.disconnect();
        initialized.current = false;
      }
    };
  }, [user]);

  return socket;
};
