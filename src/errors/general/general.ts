import { CustomError } from "../CustomError.js";

export class EnvVarNotFoundError extends CustomError {
    
    constructor(message: string,statusCode: number = 500) {
      super(message,statusCode);
    
  
      // Set the prototype explicitly to ensure the correct behavior
      Object.setPrototypeOf(this, EnvVarNotFoundError.prototype);
    }
  }
  