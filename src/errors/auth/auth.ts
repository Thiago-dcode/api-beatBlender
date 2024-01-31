import { CustomError } from "../CustomError.js";

export class AuthorizationError extends CustomError {
  constructor(message: string, statusCode: number = 401) {
    super(message, statusCode);

    // Set the prototype explicitly to ensure the correct behavior
    Object.setPrototypeOf(this, AuthorizationError.prototype);
  }
}
