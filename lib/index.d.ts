import { Strategy as PassportStrategy } from 'passport-strategy';
import { Request } from 'express';
import { AuthenticateOptions } from 'passport'

export type CardanoWeb3StrategyOptions = {
    expirationTimeSpan: Number,
    hostname: String
}

export type CardanoWeb3AuthenticateOptions = {
    action: String
} & AuthenticateOptions

export declare class Strategy extends PassportStrategy {
    constructor(options: CardanoWeb3StrategyOptions);
    authenticate(req: Request, options?: CardanoWeb3AuthenticateOptions): any;
}


