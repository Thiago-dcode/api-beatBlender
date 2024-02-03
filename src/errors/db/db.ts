import { CustomError } from "../CustomError.js";

export class EntityAlreadyExistsError extends CustomError {
  constructor(message: string,errors:{[key:string]:string}, statusCode: number = 409) {
    super(message,errors, statusCode);

    // Set the prototype explicitly to ensure the correct behavior
    Object.setPrototypeOf(this, EntityAlreadyExistsError.prototype);
  }
}

export class EntityNotFoundError extends CustomError {
  constructor(message: string,errors:{[key:string]:string}, statusCode: number = 404) {
    super(message,errors, statusCode);

    // Set the prototype explicitly to ensure the correct behavior
    Object.setPrototypeOf(this, EntityNotFoundError.prototype);
  }
}
export class RedisError extends CustomError {
  constructor(message: string,errors:{[key:string]:string}, statusCode: number = 500) {
    super(message,errors,statusCode);

    // Set the prototype explicitly to ensure the correct behavior
    Object.setPrototypeOf(this, RedisError.prototype);
  }
}
export class UnknowDbError extends CustomError {
  constructor(message: string, errors:{[key:string]:string} = {}, statusCode: number = 500) {
    super(message,errors, statusCode);

    // Set the prototype explicitly to ensure the correct behavior
    Object.setPrototypeOf(this, UnknowDbError.prototype);
  }
}
