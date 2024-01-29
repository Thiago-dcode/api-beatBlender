import { Prisma } from "@prisma/client";
import { number } from "zod";
type error = {
  target: string;
  message: string;
  code: number;
};
export const handleError = (error: unknown) => {
  let _error: error = {
    code: 500,
    target: "server",
    message: "Server error",
  };
  if (!(error instanceof Error)) {
    return _error;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        let target = Array.isArray(error.meta?.target)
          ? error.meta?.target[0]
          : "field";
        _error.target = target;
        _error.message = "Already exist";
        _error.code = 422;
        break;

      default:
        _error.target = error.code;
        _error.message = error.message;
        _error.code = 422;
        break;
    }
  } else if (error instanceof Prisma.PrismaClientInitializationError) {
   
  } 

  return _error;
};
