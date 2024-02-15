import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { handleError, sendErrResponse } from "../errors/handleErrors.js";


export const errorHandlerMiddleware = (
  err: ErrorRequestHandler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  sendErrResponse(res, err, handleError);
  next(err);
};
