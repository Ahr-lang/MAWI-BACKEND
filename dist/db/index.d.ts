import { Pool } from 'pg';
import { Sequelize } from 'sequelize';
declare const TENANTS: Record<string, {
    database: string;
}>;
declare function getPool(tenant: string): Pool;
declare function getSequelize(tenant: string): Sequelize;
declare function connectDB(): Promise<void>;
export { getPool, getSequelize, connectDB, TENANTS };
//# sourceMappingURL=index.d.ts.map