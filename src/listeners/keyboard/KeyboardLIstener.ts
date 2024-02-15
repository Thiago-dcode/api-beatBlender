import Listener from "../Listener.js";
import { KeyboardEvents, KeyboardEventData } from "./type.js";
import onDelete from "./handlers/onDelete.js";
import onCreate from "./handlers/onCreate.js";

export default class KeyboardListener extends Listener {
  static events = KeyboardEvents;
  static runEvents(method: string) {
    switch (method.toLowerCase()) {
      case "post":
        super.event.on(this.events.Create, onCreate);
        break;
      case "patch":
        break;
      case "delete":
        super.event.on(this.events.Delete, onDelete);
        break;
      default:
        break;
    }
  }
  static removeEvents(method: string): void {
    switch (method.toLowerCase()) {
      case "post":
        super.event.removeListener(this.events.Create, onCreate);
        break;
      case "patch":
        break;
      case "delete":
        super.event.removeListener(this.events.Delete, onDelete);
        break;
      default:
        break;
    }
  }
  static on<T extends KeyboardEvents>(
    eventName: T,
    callback: (data: KeyboardEventData[T]) => void
  ) {
    super.event.on(eventName, callback);
  }

  static emit<T extends KeyboardEvents>(
    eventName: T,
    data: KeyboardEventData[T]
  ) {
    super.event.emit(eventName, data);
  }
}
