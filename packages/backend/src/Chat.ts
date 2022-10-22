import { TChatMessage, TChatResponse } from './types';
import { EmitterFactory } from './utils/EmitterFactory';

class Chat extends EmitterFactory<{ updateChat: TChatResponse[] }> {
  static messages: TChatMessage[] = [
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
  constructor() {
    super();
  }

  addMessage = (user: string, message: string) => {
    const msg = {
      id: Chat.messages.length,
      user,
      message,
      date: new Date(),
    };
    Chat.messages.push(msg);
    this.emit('updateChat', [
      {
        message: msg.message,
        date: msg.date,
        user: msg.user,
      },
    ]);
  };

  getHistory = (limit = 10) => {
    const historySlice: TChatResponse[] = Chat.messages.slice(-1 * limit).map((message) => {
      return {
        user: message.user,
        date: message.date,
        message: message.message,
      };
    });
    this.emit('updateChat', historySlice);
  };
}

export default Chat;
