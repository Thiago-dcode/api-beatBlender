import { Prisma } from "@prisma/client";
import { CustomError } from "./CustomError.js";
import { Response } from "express";

type errorObj = {
  target: string;
  message: string;
  code: number;
};

export const handleError = (error: unknown): errorObj => {
  let errorObj: errorObj = {
    code: 500,
    target: "server",
    message: "Server error",
  };

  if (!(error instanceof Error)) {
    return errorObj;
  }

  // Custom errors
  if (error instanceof CustomError) {
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
        errorObj.message = "Already exists";
        errorObj.code = 422;
        break;
      default:
        errorObj.target = error.code;
        errorObj.message = error.message;
        errorObj.code = 422;
        break;
    }
  } else if (error instanceof Prisma.PrismaClientInitializationError) {
    // Handle Prisma initialization error
    errorObj.target = "prismaInitialization";
    errorObj.message = "Prisma initialization error";
    errorObj.code = 500;
  } else {
    errorObj.target = "server";
    errorObj.message = "Server error";
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
    [err.target]: [err.message],
  });
}
