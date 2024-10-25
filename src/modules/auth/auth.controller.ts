import { Controller, Get, Post, Body, Version, VERSION_NEUTRAL, Res, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { SignInDto, SingUpDto } from './dto/users.dto';
import { Roles } from './decorator/roles.decorator';
import { UserRole } from 'src/common/enum/userrule.enum';
import { RefreshTokenGuard } from './guard/refreshToken.guard';
import { CsrfTokenGuard } from './guard/csrfToken.guard';
import { RulesGuard } from './guard/rule.guard';
import { AuthGuard } from '@nestjs/passport';
import { CSRFTokenPayloadDto, RefreshTokenPayloadDto, TokenDto } from './dto/token.dto';

export interface IUserAddedRequest extends Request {
    user: any;  // User is already an Interface
}


@Controller('auth')
// @Controller({ path: 'auth', version: [VERSION_NEUTRAL] })
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post("signup")
    @Version([VERSION_NEUTRAL, '', '1'])
    singUp(@Body() createUserDto: SingUpDto, @Res({ passthrough: true }) res: Response) {
        return this.authService.createUser(createUserDto);
    }

    @Get("email")
    @Version([VERSION_NEUTRAL, '', '1'])
    verifyemail(@Body() createUserDto: SingUpDto, @Res({ passthrough: true }) res: Response) {
        return this.authService.createUser(createUserDto);
    }

    @Post("signin")
    @Version([VERSION_NEUTRAL, '', '1'])
    async signIn(@Body() userDto: SignInDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const token: TokenDto = await this.authService.createToken(userDto, req.headers['user-agent']);
        res.cookie('refreshToken', token.refresh, {
            httpOnly: true,
            secure: process.env.ENV_MODE === 'dev' ? false : true,
            sameSite: 'lax',
            maxAge: 1000 * Number(process.env.JWT_RFRESH_EXP),
            path: '/auth/refresh',
        });
        return token.access;
    }

    @Post("signout")
    @Version([VERSION_NEUTRAL, '', '1'])
    async signOut(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        res.clearCookie('refreshToken', { httpOnly: true, path: '/auth/refresh' });
        res.clearCookie('x-csrf-token', { httpOnly: true, path: '/' });
        return true;
    }

    @Get('csrf-token')
    @Version([VERSION_NEUTRAL, '', '1'])
    @Roles(UserRole.USER)
    @UseGuards(AuthGuard("jwt_access"), RulesGuard)
    async getCsrfToken(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const token: string = await this.authService.createCSRFToken(new CSRFTokenPayloadDto(req.headers['user-agent']));
        return token;
    }


    @Post("upate-access")
    @Version([VERSION_NEUTRAL, '', '1'])
    @UseGuards(RefreshTokenGuard, RulesGuard)
    @Roles(UserRole.USER)
    async updateAccesssToken(@Req() req: IUserAddedRequest, @Res({ passthrough: true }) res: Response) {
        this.authService.updateAccessToken(req.user);
        return true;
    }

    @Post("upate-refresh")
    @Version([VERSION_NEUTRAL, '', '1'])
    @UseGuards(RefreshTokenGuard, RulesGuard)
    @Roles(UserRole.USER)
    async updateRefreshToken(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        return true;
    }

}
