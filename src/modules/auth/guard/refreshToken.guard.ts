
import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) { }
    canActivate(context: ExecutionContext): boolean {
        const request: Request = context.switchToHttp().getRequest();
        const refreshToken = request.cookies['refresh-token'];
        if (!refreshToken) {
            throw new HttpException('Refresh token is missing', HttpStatus.CONFLICT);
        }
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: process.env.JWT_RFRESH_KEY,
            });
            request.user = payload;
            return true;
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw new HttpException('Refresh token has expired', HttpStatus.CONFLICT);
            }
            throw new HttpException('Invalid refresh token', HttpStatus.CONFLICT);
        }
    }
}