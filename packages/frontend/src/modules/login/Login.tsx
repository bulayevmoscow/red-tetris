import React, { useContext } from 'react';
import { useLocalStorage } from '@/utils/useLocalStorage';
import { SocketConnectContext } from '@/providers/SocketConnectProvider';

export const Login: React.FC = () => {
  const [name, setName] = useLocalStorage('user');
  const { connect, isConnected } = useContext(SocketConnectContext);
  const onLogin = () => {
    connect(name);
  };
  return (
    <div>
      <input type="text" onChange={(el) => setName(el.target.value)} />
      <p>
        login: {name}, {String(isConnected)}
      </p>
      <button onClick={onLogin}>login</button>
    </div>
  );
};
