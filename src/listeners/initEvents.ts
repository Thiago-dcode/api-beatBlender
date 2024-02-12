import Listener from "./Listener.js";
import SoundListener from "./sound/SoundListener.js";
import { SoundEvents } from "./sound/type.js";
import SoundFolderListener from "./soundFolder/SoundFolderListener.js";
import { SoundFolderEvents } from "./soundFolder/type.js";
import UserListener from "./user/UserListener.js";
import { UserEvents } from "./user/type.js";

export function initEvents() {
  SoundFolderListener.runEvents();
  UserListener.runEvents();
  SoundListener.runEvents();
}

export function initErrorEvents(callback: (data: Error) => void) {
  Listener.on("error", callback);
}
