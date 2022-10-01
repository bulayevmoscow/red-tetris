import { useContext, useEffect, useState } from 'react';
import { SocketConnectContext } from '@/providers/SocketConnectProvider';
import { socket } from '@/providers/socketIoAdapter';
import { TRoomInfo } from '@/providers/types';

export const useListOfRooms = () => {
  const { isConnected } = useContext(SocketConnectContext);
  const [listOfRooms, setListOfRooms] = useState<TRoomInfo[]>([]);

  useEffect(() => {
    socket.on('updateRoomList', (args) => {
      setListOfRooms(args);
      console.log('updateRoomList', args);
    });
  }, []);

  return { listOfRooms };
};
