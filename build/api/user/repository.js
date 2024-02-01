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
    async updateByUsername(username, data) {
        const user = await this.db.user.update({
            where: {
                username,
            },
            data,
        });
        return user;
    }
    async findByColumn(column, value) {
        return await this.db.user.findFirst({
            where: {
                [column]: value,
            },
        });
    }
}
