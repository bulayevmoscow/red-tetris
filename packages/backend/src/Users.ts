type TUserData = {
  name: string;
};

class UsersClass {
  constructor(private users = new Map<string, { name: string }>()) {}

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
      return null;
    }

    return this.users.set(socketID, { name });
  };

  removeUser = (socketID: string) => {
    return this.users.delete(socketID);
  };

  getAllUsers = () => {
    return this.users;
  };
}

export default new UsersClass();
