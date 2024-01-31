import { CustomError } from "../CustomError.js";

export class EntityAlreadyExistsError extends CustomError {
  constructor(message: string, statusCode: number = 409) {
    super(message, statusCode);

    // Set the prototype explicitly to ensure the correct behavior
    Object.setPrototypeOf(this, EntityAlreadyExistsError.prototype);
  }
}

export class EntityNotFoundError extends CustomError {
  constructor(message: string, statusCode: number = 404) {
    super(message, statusCode);

    // Set the prototype explicitly to ensure the correct behavior
    Object.setPrototypeOf(this, EntityNotFoundError.prototype);
  }
}
