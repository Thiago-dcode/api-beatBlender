export class CustomError extends Error {
  public statusCode: number;
  public errors: { [key: string]: string };


  constructor(
    message: string,
    errors: { [key: string]: string } = {},
    statusCode: number
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;

    // Set the prototype explicitly to ensure the correct behavior
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}
