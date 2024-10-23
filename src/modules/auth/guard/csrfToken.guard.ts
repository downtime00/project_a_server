import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { CSRFTokenPayloadDto } from '../dto/token.dto';

@Injectable()
export class CsrfTokenGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) { }
    canActivate(context: ExecutionContext): boolean {
        const request: Request = context.switchToHttp().getRequest();
        const csrfToken = request.cookies['x-csrf-token'];
        if (!csrfToken) {
            throw new HttpException('x-csrf-token header token is missing', HttpStatus.FORBIDDEN);
        }
        try {
            const payload: CSRFTokenPayloadDto = this.jwtService.verify(csrfToken, { secret: process.env.JWT_CSRF_KEY });
            if (request.headers['user-agent'] !== payload.useragent) {
                throw new HttpException('CSRF token matching failed', HttpStatus.FORBIDDEN);
            }
            return true;
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw new HttpException('CSRF token has expired', HttpStatus.CONFLICT);
            }
            throw new HttpException('Invalid CSRF token', HttpStatus.FORBIDDEN);
        }
    }
}

