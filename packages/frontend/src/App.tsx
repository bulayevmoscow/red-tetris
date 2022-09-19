import React, { useEffect, useState } from 'react';
import './App.css';
import { Logger } from '@/modules/logger';
import { SocketChatProvider } from '@/providers/SocketChatProvider';
import { Chat } from '@/modules/chat/chat';

export const App = () => {
  const [count, setCount] = useState(0);

  // useEffect(() => {}, []);

  return (
    <SocketChatProvider>
      <Chat />
    </SocketChatProvider>
  );
};
