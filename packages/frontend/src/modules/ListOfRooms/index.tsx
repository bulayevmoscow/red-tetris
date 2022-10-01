import React, { FC, useRef } from 'react';

import { useListOfRooms } from '@/modules/ListOfRooms/useListOfRooms';
import { socket } from '@/providers/socketIoAdapter';
export const ListOfRooms: FC = () => {
  const { listOfRooms } = useListOfRooms();
  const roomNameRef = useRef<HTMLInputElement>(null);
  return (
    <div style={{ border: '1px solid red' }}>
      <h3>rooms</h3>
      <div>
        {listOfRooms.map((room) => {
          return (
            <div key={room.key}>
              <p>key: {room.key}</p>
              <p>name: {room.name}</p>
              <p>users: {room.users}</p>
            </div>
          );
        })}
      </div>
      <div>
        <input type="text" placeholder={'room name'} ref={roomNameRef} />
        <button>add Room</button>
        <button
          onClick={() => {
            if (roomNameRef.current?.value) {
              socket.emit(
                'createRoom',
                { roomName: roomNameRef.current?.value, isSingleGame: true },
                (responseData) => {
                  console.log('Callback called with data:', responseData);
                }
              );
            }
          }}
        >
          Test button
        </button>
      </div>
    </div>
  );
};
