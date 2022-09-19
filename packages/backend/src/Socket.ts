import { Server } from './index';
import { TChatMessage } from './types';
import Users from './Users';

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
  // private users: typeof users;
  constructor(private io: Server['io'], private users = Users) {
    this.io.on('connection', (socket) => {
      console.log(socket.handshake.query.name);
      if (socket.handshake.query.name && users.createUser(socket.id, String(socket.handshake.query.name))) {
        console.log('userIsCreated');
      } else {
        socket.disconnect();
        console.log('user is exitst');
      }
      console.log(socket.handshake.query);
      socket.emit('chatHistory', chatHistory);
      socket.join('chat');

      // console.log(socket);

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
