import { Strategy as PassportStrategy } from "passport-strategy";
import passport from "passport";


export type CardanoWeb3StrategyOptions = {
  expirationTimeSpan: Number;
  hostname: String;
};

export declare class Strategy extends PassportStrategy {
  constructor(options: CardanoWeb3StrategyOptions);
}

declare namespace CardanoWeb3Strategy {
    interface AuthenticateOptions extends passport.AuthenticateOptions{
        action?: string | undefined;
      }
}

export = CardanoWeb3Strategy