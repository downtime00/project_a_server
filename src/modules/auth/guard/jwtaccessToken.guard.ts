import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

/**
 * passport 실험용 Refresh 토큰처럼 구현할 수 있다.
 */
@Injectable()
export class AccessTokenGuard extends AuthGuard("access_token") { }