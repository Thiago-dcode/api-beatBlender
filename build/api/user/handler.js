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
import { db } from "../../db/db.js";
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
            const body = req.body;
            try {
                const result = yield user.new(body);
            }
            catch (error) {
                // TODO: handle errors
            }
        });
    }
}
export default new UserHandler();
