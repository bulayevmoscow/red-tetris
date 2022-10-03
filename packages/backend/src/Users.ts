import { Logger } from './Logger';
import { socket } from 'red-tetris-frontend/src/providers/socketIoAdapter';

export class User {
  public socketId: string;
  public name: string;
  constructor({ name, socketId }: { name: string; socketId: string }) {
    this.name = name;
    this.socketId = socketId;
  }
}

export default class Users {
  public static users = new Map<string, User>();
  constructor(private logger = new Logger()) {
    setInterval(() => {
      console.clear();
      console.log(Date.now());

      console.log(Users.users);
    }, 100);
  }

  // getUserData = (socketID: string) => {
  //   return Users.users.get(socketID);
  // };
  getUserByName = (socketId: string): User | undefined => {
    return Users.users.get(socketId);
  };
  getUserBySocketId = (socketId: string): User | undefined => {
    const listOfUsers = Array.from(Users.users.entries());
    const res = listOfUsers.find((value) => {
      return value[1].socketId === socketId;
    });

    return res?.[1];
  };

  createUser = (socketID: string, name: string) => {
    if (Users.users.get(name)) {
      this.logger.setMessage({ header: 'createUser[error]', params: { socketID, name } });
      return null;
    }
    this.logger.setMessage({ header: 'createUser[created!]', params: { socketID, name } });
    return Users.users.set(name, new User({ socketId: socketID, name }));
  };
  removeUser = (by: { socketId: string } | { name: string }) => {
    let status: 'SUCCESS' | 'ERROR' = 'ERROR';

    if ('socketId' in by) {
      const user = this.getUserBySocketId(by.socketId);
      if (user) {
        Users.users.delete(user.name);
        status = 'SUCCESS';
      }
    } else if ('name' in by) {
      const user = Users.users.has(by.name);
      if (user) {
        Users.users.delete(by.name);
        status = 'SUCCESS';
      }
    }
    if (status === 'SUCCESS') {
      this.logger.setMessage({
        header: 'removeUser[removed] success',
        params: by,
      });
    } else if (status === 'ERROR') {
      this.logger.setMessage({
        header: 'removeUser[removed] error',
        params: by,
      });
    }
  };
}
