import { Server } from './index';
import Users from './Users';
import Chat from './Chat';

class Socket {
  constructor(private io: Server['io'], private users = Users, private chat = Chat) {
    this.io.on('connection', (socket) => {
      if (socket.handshake.query.name && users.createUser(socket.id, String(socket.handshake.query.name))) {
        console.log('userIsCreated');
      } else {
        socket.disconnect();
        console.log('user is exitst');
      }
      socket.on('disconnect', () => {
        users.removeUser(socket.id);
      });
      socket.on('getAllUsers', () => {
        return '123';
      });

      socket.emit('chatHistory', this.chat.getHistory());
      socket.join('chat');

      socket.on('sendMessage', ({ message }) => {
        if (message) {
          const user = this.users.getUserData(socket.id);
          const msg = this.chat.addMessage(user?.name ?? 'someUser', message);
          io.in('chat').emit('updateChat', [msg]);
        }
      });
    });
  }
}

export const SocketInit = (io: Server['io']) => {
  new Socket(io);
};
