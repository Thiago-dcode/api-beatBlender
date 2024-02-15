import Listener from "../Listener.js";
import onCreate from "./handlers/onCreate.js";
import onDelete from "./handlers/onDelete.js";

import { UserEvents, UserData } from "./type.js";

export default class UserListener extends Listener {
  static events = UserEvents;
  static runEvents(method: string) {
    switch (method.toLowerCase()) {
      case "post":
        super.event.on(UserEvents.Create, onCreate);
        break;
      case "patch":
        break;
      case "delete":
        super.event.on(UserEvents.Delete, onDelete);
        break;
      default:
        break;
    }
  }
  static removeEvents(method: string) {
    switch (method.toLowerCase()) {
      case "post":
        super.event.removeListener(UserEvents.Create, onCreate);
        break;
      case "patch":
        break;
      case "delete":
        super.event.removeListener(UserEvents.Delete, onDelete);
        break;
      default:
        break;
    }
   
    super.event.removeAllListeners(this.events.Error);
    super.event.removeAllListeners(this.events.SuccessCreate);
  }
  static on<T extends UserEvents>(
    eventName: T,
    callback: (data: UserData[T]) => void
  ) {
    super.event.on(eventName, callback);
  }
  static emit<T extends UserEvents>(eventName: T, data: UserData[T]) {
    super.event.emit(eventName, data);
  }
}
