export class CustomError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;

    // Set the prototype explicitly to ensure the correct behavior
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}
