import React, { useContext, useRef } from 'react';
import { ChatContext } from '@/providers/SocketChatProvider';
import { SocketConnectContext } from '@/providers/SocketConnectProvider';

export const Chat: React.FC = () => {
  const { chatMessages, sendMessage } = useContext(ChatContext);
  const { isConnected } = useContext(SocketConnectContext);
  const chatInputRef = useRef<HTMLInputElement>(null);
  const onSendMessage = () => {
    const msg = chatInputRef.current?.value;
    if (msg) {
      sendMessage(msg);
    }
  };
  return (
    <div>
      messages:
      <br />
      {chatMessages.map((record, index) => {
        return (
          // @ts-ignore
          <div key={index}>
            {record.user}[{record.date}]: {record.message}[{record.id}]
          </div>
        );
      })}
      <br />
      <input type="text" placeholder={'message'} ref={chatInputRef} />
      <button disabled={!isConnected} onClick={onSendMessage}>
        Send
      </button>
    </div>
  );
};
