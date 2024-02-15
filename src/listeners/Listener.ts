import EventEmitter from "events";
import { GlobalEvents } from "./globalTypes.js";

export default class Listener {
  protected static event = new EventEmitter();
  static events: any;
  static runEvents(method:string) {
    throw new Error(
      "Method not implemented. Child classes must implement the 'runEvents' method."
    );
  }
  static removeEvents(method:string) {
    this.event.removeAllListeners(GlobalEvents.Success)
    this.event.removeAllListeners(GlobalEvents.Error)
  }
  static on(eventName: string, callback: (data: any) => void) {
    
    this.event.on(eventName, callback);
  }
  static emit(eventName: string, data: any) {
   
    this.event.emit(eventName, data);
  }
}
