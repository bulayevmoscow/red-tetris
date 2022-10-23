import React, { FC, useRef } from 'react';

import { useListOfRooms } from '@/modules/ListOfRooms/useListOfRooms';
import { socket } from '@/providers/socketIoAdapter';
export const ListOfRooms: FC = () => {
  const { listOfRooms, addGamerToRoom, removeGamerFromRoom, addSpectatorToRoom, removeSpectatorFromRoom } =
    useListOfRooms();
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
              {room.spectators && <p>spectators: {room.spectators}</p>}
              <div>
                <button onClick={() => addGamerToRoom(room.key)}>addGamerToRoom</button>
                <button onClick={() => removeGamerFromRoom(room.key)}>removeGamerFromRoom</button>
                <br />
                <button onClick={() => addSpectatorToRoom(room.key)}>addSpectatorToRoom</button>
                <button onClick={() => removeSpectatorFromRoom(room.key)}>removeSpectatorFromRoom</button>
              </div>
              {/* <div>
                <button onClick={() => joinToRoomAsSpectator(room.key)}>add spectator</button>
                <button onClick={() => leaveToRoomAsSpectator(room.key)}>remove spectator</button>
              </div> */}
            </div>
          );
        })}
      </div>
      <div>
        <input type="text" placeholder={'room name'} ref={roomNameRef} />
        {/*<button>add Room</button>*/}
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
          add Room
        </button>
      </div>
    </div>
  );
};
