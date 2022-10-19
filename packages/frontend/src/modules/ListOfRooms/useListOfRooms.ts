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
  const leaveGamerFromRoom = (roomId: string) => {
    socket.emit('leaveGamerFromRoom', { roomId }, () => {
      console.log(`removed`);
    });
  };

  // const joinToRoomAsSpectator = (roomId: string) => {
  //   socket.emit('joinToRoomAsSpectator', { roomId }, () => {
  //     console.log(`removed`);
  //   });
  // };

  // const leaveToRoomAsSpectator = (roomId: string) => {
  //   socket.emit('leaveToRoomAsSpectator', { roomId }, () => {
  //     console.log(`removed`);
  //   });
  // };

  useEffect(() => {
    socket.on('updateRoomList', (args) => {
      setListOfRooms(args);
      console.log('updateRoomList', args);
    });
  }, []);

  return { listOfRooms, addGamerToRoom, leaveGamerFromRoom,
    //  joinToRoomAsSpectator, leaveToRoomAsSpectator 
    };
};
