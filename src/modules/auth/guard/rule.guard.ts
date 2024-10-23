
import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/common/enum/userrule.enum';
import { ROLES_KEY } from '../decorator/roles.decorator';
import { AccessTokenPayloadDto } from '../dto/token.dto';

@Injectable()
export class RulesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }
    canActivate(context: ExecutionContext): boolean {
        const request: Request = context.switchToHttp().getRequest();
        const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles) {
            throw new HttpException('Forbidden', HttpStatus.FORBIDDEN)
        }
        const user_role: AccessTokenPayloadDto = request.user ? request.user as AccessTokenPayloadDto : undefined;
        if (user_role === undefined) {
            return false;
        }
        return requiredRoles.some((role) => user_role.role >= role);
    }
}