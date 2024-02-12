import { CustomError } from "../CustomError.js";

export class MembershipExceedLimitError extends CustomError {
  constructor(
    message: string,
    errors: { [key: string]: string },
    statusCode: number = 403
  ) {
    super(message, errors, statusCode);

    // Set the prototype explicitly to ensure the correct behavior
    Object.setPrototypeOf(this, MembershipExceedLimitError.prototype);
  }
}
