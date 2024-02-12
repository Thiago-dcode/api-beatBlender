import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { handleError, sendErrResponse } from "../errors/handleErrors.js";

import Listener from "../listeners/Listener.js";
import { initErrorEvents } from "../listeners/initEvents.js";
import logger from "../services/logger/logger.js";

export const errorHandlerMiddleware = (
  err: ErrorRequestHandler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  sendErrResponse(res, err, handleError);
  next(err);
};

export const errorDuringEventMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  Listener.on("error", (err) => {
    logger.daily.error("Listener error", err);
 console.error("Listener error", err);
  });
  next();
};
