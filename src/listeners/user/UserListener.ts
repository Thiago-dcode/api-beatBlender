import Listener from "../Listener.js";
import onCreate from "./handlers/onCreate.js";

import { UserEvents, UserData } from "./type.js";

export default class UserListener extends Listener {
  static runEvents() {
    super.event.on(UserEvents.Create, onCreate);
  }

  static emit<T extends UserEvents>(eventName: T, data: UserData[T]) {
    super.event.emit(eventName, data);
  }
}
