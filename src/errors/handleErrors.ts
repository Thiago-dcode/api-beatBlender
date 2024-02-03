import { Prisma } from "@prisma/client";
import { CustomError } from "./CustomError.js";
import { Response } from "express";

type errorObj = {
  errors: { [key: string]: string };
  message: string;
  code: number;
};

export const handleError = (error: unknown): errorObj => {
  let errorObj: errorObj = {
    code: 500,
    errors: {},
    message: "Server error",
  };

  if (!(error instanceof Error)) {
    return errorObj;
  }
  if (error instanceof CustomError) {
    errorObj.code = error.statusCode;
    errorObj.message = error.message;
    errorObj.errors = error.errors;
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        // Duplicate key violation in the database
        let target = Array.isArray(error.meta?.target)
          ? error.meta?.target[0]
          : "field";
        errorObj.errors = {};
        errorObj.message =
          "Duplicate key violation in the database of " + target;
        errorObj.code = 422;
        break;
      default:
        errorObj.errors = {};
        errorObj.message = error.message;
        errorObj.code = 422;
        break;
    }
  } else if (error instanceof Prisma.PrismaClientInitializationError) {
    // Handle Prisma initialization error
    errorObj.errors = {};
    errorObj.message = "Prisma initialization error";
    errorObj.code = 500;
  } else {
    errorObj.errors = {};
    errorObj.message = error.message;
    errorObj.code = 500;
  }

  return errorObj;
};

export function sendErrResponse(
  res: Response,
  error: unknown,
  errorCallback: (error: unknown) => errorObj
) {
  const err = errorCallback(error);
  return res.status(err.code).json({
    errors: err.errors,
    message: err.message
  });
}
