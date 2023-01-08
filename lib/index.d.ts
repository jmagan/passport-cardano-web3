import { Strategy as PassportStrategy } from 'passport-strategy';
import { Request } from 'express';

export declare class Strategy extends PassportStrategy {
    constructor(verify: VerifyCallback);
    authenticate(req: Request, options?: any): any;
}


