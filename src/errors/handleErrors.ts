import { Prisma } from "@prisma/client";
import { EntityAlreadyExistsError, EntityNotFoundError } from "./db/db.js";
type errorObj = {
  target: string;
  message: string;
  code: number;
};
export const handleError = (error: unknown) => {
  let errorObj: errorObj = {
    code: 500,
    target: "server",
    message: "Server error",
  };
  if (!(error instanceof Error)) {
    return errorObj;
  }
  if (
    error instanceof EntityAlreadyExistsError ||
    error instanceof EntityNotFoundError
  ) {
    errorObj.code = error.statusCode;
    errorObj.message = error.message;
    errorObj.target = "error";
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        // Duplicate key violation in the database
        let target = Array.isArray(error.meta?.target)
          ? error.meta?.target[0]
          : "field";
        errorObj.target = target;
        errorObj.message = "Already exist";
        errorObj.code = 422;
        break;

      default:
        errorObj.target = error.code;
        errorObj.message = error.message;
        errorObj.code = 422;
        break;
    }
  } else if (error instanceof Prisma.PrismaClientInitializationError) {
  } else {
    errorObj.target = "server";
    errorObj.message = "Server error";
    errorObj.code = 500;
  }

  return errorObj;
};
