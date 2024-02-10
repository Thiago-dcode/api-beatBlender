import Listener from "../Listener.js";
import onCreateMany from "./handlers/onCreateMany.js";

import { SoundEvents, SoundData } from "./type.js";

export default class SoundListener extends Listener {
  static runEvents() {
    super.event.on(SoundEvents.CreateMany, onCreateMany);
  }

  static emit<T extends SoundEvents>(eventName: T, data: SoundData[T]) {
    super.event.emit(eventName, data);
  }
}
