import { useContext, useEffect, useState } from 'react';
import { SocketConnectContext } from '@/providers/SocketConnectProvider';
import { socket } from '@/providers/socketIoAdapter';
import { TRoomInfo } from '@/providers/types';

export const useListOfRooms = () => {
  const { isConnected } = useContext(SocketConnectContext);
  const [listOfRooms, setListOfRooms] = useState<TRoomInfo[]>([]);

  const addGamerToRoom = (roomId: string) => {
    socket.emit('addGamerToRoom', { roomId }, ({ isSuccess }) => {
      console.log(`joinToRoom ${roomId} is ${isSuccess}`);
    });
  };
  const removeGamerFromRoom = (roomId: string) => {
    socket.emit('removeGamerFromRoom', { roomId }, () => {
      console.log(`removed`);
    });
  };

  const addSpectatorToRoom = (roomId: string) => {
    socket.emit('addSpectatorToRoom', { roomId }, () => {
      console.log(`removed`);
    });
  };

  const removeSpectatorFromRoom = (roomId: string) => {
    socket.emit('removeSpectatorFromRoom', { roomId }, () => {
      console.log(`removed`);
    });
  };

  useEffect(() => {
    socket.on('updateRoomList', (args) => {
      setListOfRooms(args);
      console.log('updateRoomList', args);
    });
  }, []);

  return { listOfRooms, addGamerToRoom, removeGamerFromRoom, addSpectatorToRoom, removeSpectatorFromRoom };
};
