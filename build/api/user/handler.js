import UserRepository from "./repository.js";
import { db } from "../../db/db.js";
import { validateCreate } from "./validate.js";
import { handleError } from "../../error/handleError.js";
import bcrypt from "bcryptjs";
const user = new UserRepository(db());
class UserHandler {
    constructor() { }
    async index(req, res) {
        try {
            const all = await user.all();
            res.status(200).json(all);
        }
        catch (error) {
            const err = handleError(error);
            return res.status(err.code || 500).json({
                [err.target]: [err.message],
            });
        }
    }
    async create(req, res) {
        try {
            const result = validateCreate(req.body);
            if (!result.success) {
                return res.status(422).json(result.error.flatten().fieldErrors);
            }
            //TODO: hash password
            const passwordHashed = await bcrypt.hash(result.data.password, 10);
            result.data.password = passwordHashed;
            const userCreateResult = await user.new(result.data);
            res.json(userCreateResult);
        }
        catch (error) {
            console.log("Error in UserHandler.create:", error);
            const err = handleError(error);
            return res.status(err.code || 500).json({
                [err.target]: [err.message],
            });
        }
    }
}
export default new UserHandler();
