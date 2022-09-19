import React, { useEffect, useState } from 'react';
import './App.css';
import { Logger } from '@/modules/logger';
import { SocketChatProvider } from '@/providers/SocketChatProvider';
import { Chat } from '@/modules/chat/Chat';
import { SocketConnectProvider } from '@/providers/SocketConnectProvider';
import { Login } from '@/modules/login/Login';

export const App = () => {
  const [count, setCount] = useState(0);

  // useEffect(() => {}, []);

  return (
    <SocketConnectProvider>
      <SocketChatProvider>
        <>
          <Login />
          <Chat />
        </>
      </SocketChatProvider>
    </SocketConnectProvider>
  );
};
