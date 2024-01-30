import { validateCreate, validateUpdate } from "./validate.js";
import { handleError } from "../../errors/handleErrors.js";
class UserHandler {
    constructor(userService) {
        this.userService = userService;
        this.index = async (req, res) => {
            try {
                const all = await this.userService.getAll();
                res.status(200).json(all);
            }
            catch (error) {
                console.error("Error fetching all users", error);
                const err = handleError(error);
                return res.status(err.code).json({
                    [err.target]: [err.message],
                });
            }
        };
        this.create = async (req, res) => {
            try {
                const result = validateCreate(req.body);
                if (!result.success) {
                    return res.status(422).json(result.error.flatten().fieldErrors);
                }
                const userCreateResult = await this.userService.create(result.data);
                res.json(userCreateResult);
            }
            catch (error) {
                const err = handleError(error);
                return res.status(err.code).json({
                    [err.target]: [err.message],
                });
            }
        };
        this.update = async (req, res) => {
            try {
                const username = req.params.username;
                const result = validateUpdate(req.body);
                if (!result.success) {
                    return res.status(422).json(result.error.flatten().fieldErrors);
                }
                const updateResult = await this.userService.update(username, result.data);
                res.json(updateResult);
            }
            catch (error) {
                console.error("Error updating user", error);
                const err = handleError(error);
                return res.status(err.code).json({
                    [err.target]: [err.message],
                });
            }
        };
        this.index = this.index.bind(this);
        this.create = this.create.bind(this);
    }
}
export default UserHandler;
