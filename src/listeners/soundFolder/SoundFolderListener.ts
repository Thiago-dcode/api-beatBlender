import Listener from "../Listener.js";

import onDeleteStorage from "./handlers/onDeleteStorage.js";
import onUpdateStorage from "./handlers/onUpdateStorage.js";
import { SoundFolderData, SoundFolderEvents } from "./type.js";

export default class SoundFolderListener extends Listener {
  static events = SoundFolderEvents;
  static runEvents() {
    super.event.on(this.events.UpdateStorage, onUpdateStorage);
    super.event.on(this.events.DeleteStorage, onDeleteStorage);

  }

  static emit<T extends SoundFolderEvents>(
    eventName: T,
    data: SoundFolderData[T]
  ) {
    super.event.emit(eventName, data);
  }
}
