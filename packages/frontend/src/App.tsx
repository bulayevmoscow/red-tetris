import React, { useState } from 'react';
import './App.css';
import { Logger } from '@/modules/logger';
import { SocketChatProvider } from '@/providers/SocketChatProvider';
import { Chat } from '@/modules/chat/Chat';
import { SocketConnectProvider } from '@/providers/SocketConnectProvider';
import { Login } from '@/modules/login/Login';
import { ListOfUsers } from '@/modules/ListOfUsers';
import { ListOfRooms } from '@/modules/ListOfRooms';

const paramsString = window.location.search;
const searchParams = new URLSearchParams(paramsString);

export const App = () => {
  const [logger, setLogger] = useState(false);
  const [logEnable] = useState(searchParams.get('log') ?? '');
  return (
    <SocketConnectProvider>
      <SocketChatProvider>
        <>
          {!logger && (
            <div id="app">
              <ListOfRooms />
              <ListOfUsers />
              <Login />
              <Chat />
            </div>
          )}
          {logEnable && (
            <div id="logger">
              <button onClick={() => setLogger((prevState) => !prevState)}>Switch to only logs</button>
              <Logger />
            </div>
          )}
        </>
      </SocketChatProvider>
    </SocketConnectProvider>
  );
};
