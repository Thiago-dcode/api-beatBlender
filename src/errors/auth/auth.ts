import { CustomError } from "../CustomError.js";

export class AuthorizationError extends CustomError {
  constructor(message: string, statusCode: number = 401) {
    super(message, statusCode);

    // Set the prototype explicitly to ensure the correct behavior
    Object.setPrototypeOf(this, AuthorizationError.prototype);
  }
}

export class PayLoadNotFoundError extends CustomError {
  constructor(message: string, statusCode: number = 403) {
    super(message, statusCode);

    // Set the prototype explicitly to ensure the correct behavior
    Object.setPrototypeOf(this, PayLoadNotFoundError.prototype);
  }
}
