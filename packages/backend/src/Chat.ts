import { TChatMessage } from './types';

class Chat {
  public messages: TChatMessage[];
  constructor() {
    this.messages = [
      {
        id: 0,
        date: new Date(),
        user: 'alex',
        message: 'kekw',
      },
      {
        id: 1,
        date: new Date(),
        user: 'alex2',
        message: 'kekw2',
      },
    ];
  }

  addMessage = (user: string, message: string) => {
    const msg = {
      id: this.messages.length,
      user,
      message,
      date: new Date(),
    };
    this.messages.push(msg);
    return msg;
  };

  getHistory = (limit = 10) => {
    return this.messages.slice(-1 * limit);
  };
}

export default new Chat();
