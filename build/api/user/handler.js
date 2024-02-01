import { validateCreate, validateUpdate } from "./validate.js";
import { handleError, sendErrResponse } from "../../errors/handleErrors.js";
import { AuthorizationError } from "../../errors/auth/auth.js";
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
                sendErrResponse(res, error, handleError);
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
                console.error("Error creating user", error);
                sendErrResponse(res, error, handleError);
            }
        };
        this.update = async (req, res) => {
            try {
                const userId = req.user?.id;
                if (typeof userId === "undefined") {
                    throw new AuthorizationError("User id missing in request");
                }
                const username = req.params.username;
                // Check authorization before proceeding with the update
                await this.userService.throwErrorIfUserNotAuthToUpdate(userId, username);
                const result = validateUpdate(req.body);
                if (!result.success) {
                    return res.status(422).json(result.error.flatten().fieldErrors);
                }
                const updateResult = await this.userService.update(username, result.data);
                res.json(updateResult);
            }
            catch (error) {
                console.error("Error updating user", error);
                sendErrResponse(res, error, handleError);
            }
        };
        this.index = this.index.bind(this);
        this.create = this.create.bind(this);
    }
}
export default UserHandler;
