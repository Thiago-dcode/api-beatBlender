import EventEmitter from "events";

export default class Listener {
  protected static event = new EventEmitter();

  static runEvents() {
    throw new Error(
      "Method not implemented. Child classes must implement the 'runEvents' method."
    );
  }

  static emit(eventName: string, data: any) {
    this.event.emit(eventName, data);
  }
}
