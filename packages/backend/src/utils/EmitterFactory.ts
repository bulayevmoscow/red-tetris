import { EventEmitter } from 'events';

type EventMap = Record<string, unknown>;

type EventKey<T extends EventMap> = string & keyof T;
export type EventReceiver<T> = (params: T) => void;

interface Emitter<T extends EventMap> {
  on<K extends EventKey<T>>(eventName: K, fn: EventReceiver<T[K]>): void;
  off<K extends EventKey<T>>(eventName: K, fn: EventReceiver<T[K]>): void;
  emit<K extends EventKey<T>>(eventName: K, params: T[K]): void;
}

export abstract class EmitterFactory<T extends EventMap> implements Emitter<T> {
  private emitter = new EventEmitter();
  on<K extends EventKey<T>>(eventName: K, fn: EventReceiver<T[K]>) {
    this.emitter.on(eventName, fn);
  }

  off<K extends EventKey<T>>(eventName: K, fn: EventReceiver<T[K]>) {
    this.emitter.off(eventName, fn);
  }

  emit<K extends EventKey<T>>(eventName: K, params: T[K]) {
    this.emitter.emit(eventName, params);
  }
}
