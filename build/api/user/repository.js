var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export default class UserRepository {
    constructor(db) {
        this.db = db;
    }
    all(options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield this.db.user.findMany(options);
            return users;
        });
    }
    new(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.db.user.create({
                data,
            });
            return user;
        });
    }
    getById(id) {
        // call persistence.js
    }
}
