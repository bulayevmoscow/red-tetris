import { Server } from './index';
import { TChatMessage } from './types';

const chatHistory: TChatMessage[] = [
  {
    date: new Date(),
    user: 'alex',
    message: 'kekw',
  },
  {
    date: new Date(),
    user: 'alex2',
    message: 'kekw2',
  },
];

const count = (() => {
  let a = 0;
  return () => a++;
})();

class Socket {
  constructor(private io: Server['io']) {
    this.io.on('connection', (socket) => {
      console.log(socket.id);
      socket.emit('chatHistory', chatHistory);
      socket.join('chat');

      console.log(socket);

      socket.on('sendMessage', ({ message }) => {
        const chatMessage = {
          message,
          user: 'hx',
          date: new Date(),
        };
        if (message) {
          chatHistory.push(chatMessage);
          io.in('chat').emit('updateChat', [chatMessage]);
        }
      });
    });
    // setInterval(() => {
    //   this.io?.to('chat').emit('kekw');
    // }, 1000);
  }
}

export const SocketInit = (io: Server['io']) => {
  new Socket(io);
};
