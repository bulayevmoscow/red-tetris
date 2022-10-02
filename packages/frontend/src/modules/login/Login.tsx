import React, { useContext, useEffect, useState } from 'react';
import { useLocalStorage } from '@/utils/useLocalStorage';
import { SocketConnectContext } from '@/providers/SocketConnectProvider';

const paramsString = window.location.search;
const searchParams = new URLSearchParams(paramsString);

export const Login: React.FC = () => {
  // const [name, setName] = useLocalStorage('user');
  const [name, setName] = useState(searchParams.get('user') ?? '');
  const { connect, isConnected, disconnect } = useContext(SocketConnectContext);
  const onLogin = () => {
    connect(name);
  };

  useEffect(() => {
    if (name) {
      connect(name);
    }
  }, []);

  return (
    <div>
      <input type="text" value={name} onChange={(el) => setName(el.target.value)} />
      <p>
        login: {name}, {String(isConnected)}
      </p>
      <button onClick={onLogin}>login</button>
      <button onClick={disconnect}>logout</button>
    </div>
  );
};
