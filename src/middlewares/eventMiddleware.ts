import { NextFunction, Request, Response } from "express";
import { initEvents, removeEvents } from "../listeners/initEvents.js";
import Listener from "../listeners/Listener.js";
import logger from "../services/logger/logger.js";

export const eventMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //init events
   
  const path = req.path;
  console.log(`${req.method}: `,path)
  initEvents(path, req.method);

  

  Listener.on("error", (err) => {
    logger.daily.error("Listener error", err);
    console.error("Listener error FROM MIDDLEWARE", err);
  });

  const onFinish = () => {
    removeEvents(path, req.method);
    
  }
  res.on("finish", onFinish);
 next();
};
