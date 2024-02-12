import EventEmitter from "events";
import { GlobalEvents } from "./globalTypes.js";

export default class Listener {
  protected static event = new EventEmitter();
  static events: any;
  static runEvents() {
    throw new Error(
      "Method not implemented. Child classes must implement the 'runEvents' method."
    );
  }
  static on(eventName: string, callback: (data: any) => void) {
    
    this.event.on(eventName, callback);
  }
  static emit(eventName: string, data: any) {
   
    this.event.emit(eventName, data);
  }
}
