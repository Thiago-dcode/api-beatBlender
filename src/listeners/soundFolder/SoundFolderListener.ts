import Listener from "../Listener.js";
import onUpdateStorage from "./handlers/onUpdateStorage.js";
import { SoundFolderData, SoundFolderEvents } from "./type.js";

export default class SoundFolderListener extends Listener {
  static runEvents() {
    super.event.on(SoundFolderEvents.UpdateStorage, onUpdateStorage);
  }

  static emit<T extends SoundFolderEvents>(eventName: T, data: SoundFolderData[T]) {
    super.event.emit(eventName, data);
  }
}
