import { Request, Response, NextFunction } from "express";
import JWT from "jsonwebtoken";
import { handleError, sendErrResponse } from "../errors/handleErrors.js";
import {
  getJWTpayLoad,
  getSecretJWT,
  getTokenFromHeader,
} from "../utils/utils.js";
declare global {
  namespace Express {
    interface Request {
      user?: { id: number } | undefined;
    }
  }
}
export function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    const payload = getJWTpayLoad(JWT, getTokenFromHeader(req), getSecretJWT());
    if (typeof payload === "object" && payload !== null && "id" in payload) {
      // Assigning to the user property after ensuring it has an 'id' property
      req.user = { id: payload.id };
    } else {
      req.user = undefined;
    }

    return next();
  } catch (error) {
    sendErrResponse(res, error, handleError);
  }
}

// export async function cookieSession(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> {
//   const SID = req.cookies.SID;

//   if (!SID) {
//     throw new AuthorizationError("Unauthenticated", 401);
//   }

//   try {
//     // Access Redis
//     const session = await redis.get(`sid:${SID}`);

//     if (!session) {
//       throw new AuthorizationError("Unauthenticated", 401);
//     }

//     return next();
//   } catch (error) {
//     console.error(`Error in cookieSession middleware: ${error}`);
//     sendErrResponse(res, error, handleError);
//   }
// }
