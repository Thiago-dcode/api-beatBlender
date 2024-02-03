import { CustomError } from "../CustomError.js";

export class ImageFileTypeError extends CustomError {
    constructor(message: string,errors: {[key:string]:string}, statusCode: number = 400) {
      super(message,errors,statusCode);
  
      // Set the prototype explicitly to ensure the correct behavior
      Object.setPrototypeOf(this, ImageFileTypeError.prototype);
    }
  }