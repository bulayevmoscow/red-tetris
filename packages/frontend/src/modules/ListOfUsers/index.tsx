import { SocketConnectContext } from '@/providers/SocketConnectProvider';
import React, { useEffect, useRef } from 'react';
import { socket } from '@/providers/socketIoAdapter';

export const ListOfUsers: React.FC = () => {
  const preRef = useRef<HTMLPreElement>(null);
  useEffect(() => {}, []);

  return (
    <div>
      <pre ref={preRef}>null</pre>
      <button
        onClick={() => {
          console.log(123, socket.emit('getAllUsers'));
        }}
      >
        123
      </button>
    </div>
  );
};
