import { CustomError } from "../CustomError.js";

export class EnvVarNotFoundError extends CustomError {
  constructor(
    message: string,
    errors: { [key: string]: string },
    statusCode: number = 500
  ) {
    super(message, errors, statusCode);

    // Set the prototype explicitly to ensure the correct behavior
    Object.setPrototypeOf(this, EnvVarNotFoundError.prototype);
  }
}

export class StorageError extends CustomError {
  constructor(
    message: string,
    errors: { [key: string]: string },
    statusCode: number = 500
  ) {
    super(message, errors, statusCode);

    // Set the prototype explicitly to ensure the correct behavior
    Object.setPrototypeOf(this, StorageError.prototype);
  }
}
