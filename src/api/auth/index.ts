import authRoutes from "./authRoutes.js";
import AuthRepository from "./authRepository.js";
import { db } from "../../db/db.js";
import AuthService from "./authService.js";
import AuthHandler from "./authHandler.js";

const auth = new AuthRepository(db());
const authService = new AuthService(auth);
const authHandler = new AuthHandler(authService);

export default authRoutes(authHandler);
