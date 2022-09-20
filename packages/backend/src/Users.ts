import { LoggerClass } from './Logger';

type TUserData = {
  name: string;
};

class UsersClass {
  constructor(private users = new Map<string, { name: string }>(), private logger = new LoggerClass()) {}

  getUserData = (socketID: string): TUserData | undefined => {
    return this.users.get(socketID);
  };

  hasUser = (user: TUserData) => {
    return (
      [...this.users.entries()].findIndex((value) => {
        return value[1].name === user.name;
      }) !== -1
    );
  };

  createUser = (socketID: string, name: string) => {
    if (this.hasUser({ name })) {
      this.logger.setMessage({ header: 'createUser[error]', params: { socketID, name } });
      return null;
    }
    this.logger.setMessage({ header: 'createUser[created!]', params: { socketID, name } });
    return this.users.set(socketID, { name });
  };

  removeUser = (socketID: string) => {
    this.logger.setMessage({
      header: 'removeUser[removed]',
      params: { socketID, name: this.getUserData(socketID)?.name },
    });
    return this.users.delete(socketID);
  };

  getAllUsers = () => {
    return this.users;
  };
}

export default new UsersClass();
