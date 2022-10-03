import React, { FC, ReactElement, useEffect, useMemo, useState } from 'react';
import { socket, socketOptions } from '@/providers/socketIoAdapter';

type TSocketConnectContext = {
  disconnect: () => void;
  reconnect: (userName: string) => void;
  isConnected: boolean;
  connect: (userName: string) => void;
};

export const SocketConnectContext = React.createContext<TSocketConnectContext>({
  isConnected: false,
  connect: () => undefined,
  reconnect: () => undefined,
  disconnect: () => undefined,
});

export const SocketConnectProvider: FC<{ children: ReactElement }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('connect');
      setIsConnected(true);
    });
    socket.on('disconnect', () => {
      setIsConnected(false);
    });
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.disconnect();
    };
  }, []);

  const value = useMemo(() => {
    const connect = (userName: string) => {
      if (socketOptions?.query?.name) {
        socketOptions.query.name = userName;
      }

      socket.connect();
    };
    return {
      isConnected,
      connect,
      reconnect: (userName: string) => {
        socket.disconnect();
        connect(userName);
      },
      disconnect: () => {
        socket.disconnect();
      },
    };
  }, [isConnected]);

  return <SocketConnectContext.Provider value={value}>{children}</SocketConnectContext.Provider>;
};
