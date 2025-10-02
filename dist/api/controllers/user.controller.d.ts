declare function ensureAuthenticated(req: any, res: any, next: any): void;
declare function register(req: any, res: any): Promise<any>;
declare function login(req: any, res: any, next: any): void;
declare function me(req: any, res: any): any;
declare function logout(_req: any, res: any): any;
export { ensureAuthenticated, register, login, me, logout };
//# sourceMappingURL=user.controller.d.ts.map