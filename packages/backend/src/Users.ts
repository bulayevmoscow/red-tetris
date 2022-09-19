type TUserData = {
  name: string;
};

class UsersClass {
  constructor(private users = new Map<string, { name: string }>()) {}

  getUserData = (socketID: string): TUserData | undefined => {
    return this.users.get(socketID);
  };

  hasUser = (user: TUserData) => {
    console.log(this.users);
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
}

export default new UsersClass();