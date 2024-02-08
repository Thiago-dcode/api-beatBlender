import EventEmitter from "events";
import onUpdateStorage from "./handlers/onUpdateStorage.js";

enum SoundFolder {
  updateStorage = "updateStorage",
}

export default function soundFolderEventsRegistered(
  eventEmitter: EventEmitter
) {
  eventEmitter.on(SoundFolder.updateStorage, onUpdateStorage);
}
