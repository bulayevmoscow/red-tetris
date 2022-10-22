import React, { FC, ReactElement, useContext, useEffect, useMemo, useState } from 'react';
import { socket } from './socketIoAdapter';
import { TChatResponse } from './types';
import { SocketConnectContext } from '@/providers/SocketConnectProvider';

export const ChatContext = React.createContext<{ chatMessages: TChatResponse[]; sendMessage: (str: string) => void }>({
  chatMessages: [],
  sendMessage: (str) => str,
});

export const SocketChatProvider: FC<{ children: ReactElement }> = ({ children }) => {
  const [chatMessages, setChatMessages] = useState<TChatResponse[]>([]);
  const { isConnected } = useContext(SocketConnectContext);
  useEffect(() => {
    socket.on('updateChat', (arg) => {
      console.log(arg);
      setChatMessages((prevState) => [...prevState, ...arg]);
      console.log('updateChat');
    });
  }, []);

  useEffect(() => {
    if (!isConnected) {
      setChatMessages([]);
    }
  }, [isConnected]);

  const value = useMemo(
    () => ({
      chatMessages,
      sendMessage: (str: string) => {
        socket.emit('sendMessage', { message: str });
      },
    }),
    [chatMessages]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
