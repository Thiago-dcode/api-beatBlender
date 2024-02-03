import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { handleError, sendErrResponse } from "../errors/handleErrors.js";

export const errorHandlerMiddleware = (
  err: ErrorRequestHandler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("ERROR", err);
  sendErrResponse(res, err, handleError);
};
