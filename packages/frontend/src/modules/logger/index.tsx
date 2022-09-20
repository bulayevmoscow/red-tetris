import React, { useEffect, useState } from 'react';
import { socket } from '@/providers/socketIoAdapter';

export const Logger: React.FC = () => {
  const [logs, setLogs] = useState<string>('');

  useEffect(() => {
    console.log('addLoger');
    socket.on('updateLogs', (res) => {
      setLogs((prevState) => `${prevState}\n${JSON.stringify(res, null, '  ')}`);
    });
  }, []);

  if (logs.length === 0) {
    return null;
  }

  return <pre>{logs}</pre>;
};
