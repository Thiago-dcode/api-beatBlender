import Listener from "../Listener.js";
import { SoundEvents, SoundEventData } from "./type.js";
import onCreateMany from "./handlers/onCreateMany.js";
import onUpdate from "./handlers/onUpdate.js";
import onDelete from "./handlers/onDelete.js";
import onCreate from "./handlers/onCreate.js";

export default class SoundListener extends Listener {
  static events = SoundEvents;
  static runEvents(method: string) {
    switch (method.toLowerCase()) {
      case "post":
        super.event.on(this.events.CreateMany, onCreateMany);
        super.event.on(this.events.Create, onCreate);
        break;
      case "patch":
        super.event.on(this.events.Update, onUpdate);
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
        super.event.removeListener(this.events.CreateMany, onCreateMany);
        super.event.removeListener(this.events.Create, onCreate);
        break;
      case "patch":
        super.event.removeListener(this.events.Update, onUpdate);
        break;
      case "delete":
        super.event.removeListener(this.events.Delete, onDelete);
        break;
      default:
        break;
    }
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
