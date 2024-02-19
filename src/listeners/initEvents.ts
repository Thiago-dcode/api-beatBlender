import config from "../config/config.js";
import { extractRoute } from "../utils/utils.js";
import Listener from "./Listener.js";
import KeyboardListener from "./keyboard/KeyboardLIstener.js";
import SoundListener from "./sound/SoundListener.js";
import SoundFolderListener from "./soundFolder/SoundFolderListener.js";
import UserListener from "./user/UserListener.js";
const {
  users,
  sounds,
  keyboards,
  keys,
  "sounds-folder": soundFolder,
} = config.routes;

export function initEvents(path: string, method: string) {
  const route = extractRoute(path);

  if (route === users) {
    UserListener.runEvents(method);
  }
  if (route === sounds || route === keys) {
    SoundListener.runEvents(method);
  }
  if (route === soundFolder) {
    SoundFolderListener.runEvents(method);
  }
  if (route === keyboards) {
    KeyboardListener.runEvents(method);
  }
}
export function removeEvents(path: string, method: string) {
  const route = extractRoute(path);

  if (route === users) {
    UserListener.removeEvents(method);
  }
  if (route === sounds || route === keys) {
    SoundListener.removeEvents(method);
  }
  if (route === soundFolder) {
    SoundFolderListener.removeEvents(method);
  }
  if (route === keyboards) {
    KeyboardListener.removeEvents(method);
  }
  Listener.removeEvents(method)
}

