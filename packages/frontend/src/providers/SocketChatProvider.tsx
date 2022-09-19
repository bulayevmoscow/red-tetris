import React, { FC, ReactElement, useEffect, useState } from 'react';
import { socket } from './socketIoAdapter';

export const SocketChatProvider: FC<{ children: ReactElement }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    socket.connect();
    socket.on('connect', () => {
      console.log('connect');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });
    socket.on('pong', () => {
      // setLastPong(new Date().toISOString());
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('pong');
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    console.log('[Socket:Connect]', isConnected);
    console.log(socket.id);
  }, [isConnected]);

  return <>{children}</>;
};
