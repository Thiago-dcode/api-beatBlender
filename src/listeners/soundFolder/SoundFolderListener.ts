import Listener from "../Listener.js";

import onDeleteStorage from "./handlers/onDeleteStorage.js";
import onUpdateStorage from "./handlers/onUpdateStorage.js";
import { SoundFolderData, SoundFolderEvents } from "./type.js";

export default class SoundFolderListener extends Listener {
  static events = SoundFolderEvents;
  static runEvents(method: string) {
    switch (method.toLowerCase()) {
      case "post":
        break;
      case "patch":
        super.event.on(this.events.UpdateStorage, onUpdateStorage);
        break;
      case "delete":
        super.event.on(this.events.DeleteStorage, onDeleteStorage);
        break;
      default:
        break;
    }
  }
  static removeEvents(method: string) {
    switch (method.toLowerCase()) {
      case "post":
        break;
      case "patch":
        super.event.removeListener(this.events.UpdateStorage, onUpdateStorage);
        break;
      case "delete":
        super.event.removeListener(this.events.DeleteStorage, onDeleteStorage);
        break;
      default:
        break;
    }
  }

  static emit<T extends SoundFolderEvents>(
    eventName: T,
    data: SoundFolderData[T]
  ) {
    super.event.emit(eventName, data);
  }
}
