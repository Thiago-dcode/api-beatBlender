export class EntityAlreadyExistsError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number = 409) {
    super(message);
    this.statusCode = statusCode;
 

    // Set the prototype explicitly to ensure the correct behavior
    Object.setPrototypeOf(this, EntityAlreadyExistsError.prototype);
  }
}

export class EntityNotFoundError extends Error {
  public statusCode: number;

  constructor(message: string,statusCode: number = 404) {
    super(message);
    this.statusCode = statusCode;

    // Set the prototype explicitly to ensure the correct behavior
    Object.setPrototypeOf(this, EntityNotFoundError.prototype);
  }
}
