import { Logger } from './Logger';

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
  constructor(private logger = new Logger()) {}

  getUserData = (socketID: string) => {
    return Users.users.get(socketID);
  };

  hasUserByName = (name: string): User | undefined => {
    const listOfUsers = Array.from(Users.users.entries());
    const res = listOfUsers.find((value) => {
      return value[1].name === name;
    });

    return res?.[1];
  };

  createUser = (socketID: string, name: string) => {
    if (this.hasUserByName(name)) {
      this.logger.setMessage({ header: 'createUser[error]', params: { socketID, name } });
      return null;
    }
    this.logger.setMessage({ header: 'createUser[created!]', params: { socketID, name } });
    return Users.users.set(socketID, new User({ socketId: socketID, name }));
  };

  removeUser = (socketID: string) => {
    this.logger.setMessage({
      header: 'removeUser[removed]',
      params: { socketID, name: this.getUserData(socketID)?.name },
    });
    return Users.users.delete(socketID);
  };

  getAllUsers = () => {
    return Users.users;
  };
}
