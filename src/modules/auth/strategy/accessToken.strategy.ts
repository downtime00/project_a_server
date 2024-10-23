
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AccessTokenPayloadDto } from "../dto/token.dto";

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, "jwt_access") {
    constructor(private readonly configService: ConfigService) {
        super({
            // request의 쿠키에서 refresh token을 가져옴
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get<string>("JWT_ACCESS_KEY"),
            ignoreExpiration: false,
        });
    }

    validate(payload: AccessTokenPayloadDto) {
        return payload;
    }
}