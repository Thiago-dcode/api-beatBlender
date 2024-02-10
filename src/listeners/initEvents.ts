import SoundListener from "./sound/SoundListener.js";
import SoundFolderListener from "./soundFolder/SoundFolderListener.js";
import UserListener from "./user/UserListener.js";

export default function initEvents() {
  SoundFolderListener.runEvents();
  UserListener.runEvents();
  SoundListener.runEvents()
}
