export default class UserRepository {
    static findById(sequelize: any, id: number): Promise<{
        id: any;
        username: any;
    } | null>;
    static findByUsername(sequelize: any, username: string): Promise<{
        id: any;
        username: any;
        password_hash: any;
    } | null>;
    static authenticateUser(sequelize: any, username: string, password: string): Promise<{
        id: any;
        username: any;
    } | null>;
    static createUser(sequelize: any, username: string, passwordHash: string): Promise<{
        id: any;
        username: any;
    }>;
}
//# sourceMappingURL=user.repository.d.ts.map