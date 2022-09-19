import React, { FC, ReactElement, useEffect, useMemo, useState } from 'react';
import { socket } from './socketIoAdapter';
import { TChatMessage } from './types';

export const ChatContext = React.createContext<{ chatMessages: TChatMessage[]; sendMessage: (str: string) => void }>({
  chatMessages: [],
  sendMessage: (str) => str,
});

export const SocketChatProvider: FC<{ children: ReactElement }> = ({ children }) => {
  const [chatMessages, setChatMessages] = useState<TChatMessage[]>([]);

  useEffect(() => {
    socket.on('chatHistory', (arg) => {
      console.log('chatHistory');
      setChatMessages(arg);
    });

    socket.on('updateChat', (arg) => {
      setChatMessages((prevState) => [...prevState, ...arg]);
      console.log('updateChat');
    });
  }, []);

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
