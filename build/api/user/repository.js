export default class UserRepository {
    constructor(db) {
        this.db = db;
        this.db.$connect();
    }
    async all(options = {}) {
        const users = await this.db.user.findMany(options);
        return users;
    }
    async new(data) {
        const user = await this.db.user.create({
            data,
        });
        return user;
    }
    getById(id) {
        return id;
    }
}
