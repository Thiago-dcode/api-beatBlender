import { Request, Response, NextFunction } from "express";
import JWT from "jsonwebtoken";
import { AuthorizationError } from "../errors/auth/auth.js";
import { handleError } from "../errors/handleErrors.js";
import { env } from "../utils/utils.js";
import { EnvVarNotFoundError } from "../errors/general/general.js";
env;
interface AuthenticatedRequest extends Request {
  user?: string | JWT.JwtPayload | undefined;
}
function verifyToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const token = req.header("Authorization");
  if (!token) throw new AuthorizationError("Unauthenticated", 401);
  const secretKey = env.get("JWT_KEY");
  if (!(typeof secretKey === "string")) throw new EnvVarNotFoundError('JWT_KEY env not found',500);
  try {
    JWT.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return res.status(403).json({
          auth: "Forbidden",
        });
      }
      //success
      req.user = decoded;
      next();
    });
  } catch (error) {
    const err = handleError(error);
    return res.status(err.code).json({
      [err.target]: [err.message],
    });
  }
}

module.exports = verifyToken;
