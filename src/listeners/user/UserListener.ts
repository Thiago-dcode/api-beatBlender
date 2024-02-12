import Listener from "../Listener.js";
import onCreate from "./handlers/onCreate.js";
import onDelete from "./handlers/onDelete.js";

import { UserEvents, UserData } from "./type.js";

export default class UserListener extends Listener {
  static runEvents() {
    super.event.on(UserEvents.Create, onCreate);
    super.event.on(UserEvents.Delete, onDelete);
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
