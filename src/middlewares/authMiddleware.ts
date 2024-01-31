import { Request, Response, NextFunction } from "express";
import JWT from "jsonwebtoken";
import { AuthorizationError } from "../errors/auth/auth.js";
import { handleError, sendErrResponse } from "../errors/handleErrors.js";
import { env, getJWTpayLoad, getTokenData } from "../utils/utils.js";
import { EnvVarNotFoundError } from "../errors/general/general.js";
declare global {
  namespace Express {
    interface Request {
      user?: string | JWT.JwtPayload | undefined;
    }
  }
}
export function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    const { token, secretKey } = getTokenData(req);
    req.user = getJWTpayLoad(token, secretKey);

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
