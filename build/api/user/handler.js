var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import UserRepository from "./repository.js";
import { validateCreate } from "./validate.js";
import { db } from "../../db/db.js";
import { handleError } from "../../error/handleError.js";
import bcrypt from "bcryptjs";
const user = new UserRepository(db());
class UserHandler {
    constructor() { }
    index(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const all = yield user.all();
            res.status(200).json(all);
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = validateCreate(req.body);
                if (!result.success) {
                    return res.status(422).json(result.error.flatten().fieldErrors);
                }
                //TODO: hash password
                const passwordHashed = yield bcrypt.hash(result.data.password, 10);
                result.data.password = passwordHashed;
                const userCreateResult = yield user.new(result.data);
                res.json(userCreateResult);
            }
            catch (error) {
                if (error instanceof Error) {
                    const err = handleError(error);
                    return res.status(err.code || 500).json({
                        [err.target]: [err.message],
                    });
                }
                return res.status(500).json({
                    server: ["Server error, error is not a instanceof Error"],
                });
            }
        });
    }
}
export default new UserHandler();
