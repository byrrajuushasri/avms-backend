import {
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";

import { PassportStrategy } from "@nestjs/passport";
import {
  ExtractJwt,
  Strategy,
} from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
  "jwt",
) {
  constructor() {
    const secret =
      process.env.JWT_SECRET;

    if (!secret) {
      throw new Error(
        "JWT_SECRET is not defined in .env",
      );
    }

    console.log(
      "JWT Strategy Secret Loaded:",
      secret ? "YES" : "NO",
    );

    super({
      jwtFromRequest:
        ExtractJwt.fromAuthHeaderAsBearerToken(),

      ignoreExpiration: false,

      secretOrKey: secret,
    });
  }

  async validate(payload: any) {
    console.log(
      "JWT PAYLOAD:",
      payload,
    );

    if (!payload?.id) {
      throw new UnauthorizedException(
        "Invalid authentication token",
      );
    }

    return {
      id: payload.id,

      member_id:
        payload.member_id,

      email:
        payload.email,

      role:
        payload.role || "user",

      district:
        payload.district ?? null,

      mandal:
        payload.mandal ?? null,

      sangham:
        payload.sangham ?? null,
    };
  }
}