import Listener from "../Listener.js";
import { SoundEvents, SoundEventData } from "./type.js";
import onCreateMany from "./handlers/onCreateMany.js";
import onUpdate from "./handlers/onUpdate.js";
import onDelete from "./handlers/onDelete.js";

export default class SoundListener extends Listener {
  static events = SoundEvents;
  static runEvents() {
    super.event.on(this.events.CreateMany, onCreateMany);
    super.event.on(this.events.Update, onUpdate);
    super.event.on(this.events.Delete, onDelete);
  }

  static on<T extends SoundEvents>(
    eventName: T,
    callback: (data: SoundEventData[T]) => void
  ) {
    super.event.on(eventName, callback);
  }

  static emit<T extends SoundEvents>(eventName: T, data: SoundEventData[T]) {
    super.event.emit(eventName, data);
  }
}
