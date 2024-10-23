import { Injectable } from '@nestjs/common';
import { ExistsSignUpDto, ReturnCreateUserDto, SignInDto, SingUpDto } from './dto/users.dto';
import { ResultDataBaseDto } from 'src/common/dto/database.dto';
import { ResponDtoFactory } from 'src/common/dto/respon.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AccessTokenPayloadDto, CSRFTokenPayloadDto, RefreshTokenPayloadDto, TokenDto } from './dto/token.dto';
import { HttpMessages } from 'src/common/enum/message.enum';
import { instanceToPlain } from 'class-transformer';
import { UserRole } from 'src/common/enum/userrule.enum';
import { AuthRepository } from 'src/modules/auth/auth.repository';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly authRepository: AuthRepository
    ) { }

    async createUser(signupinfo: SingUpDto): Promise<boolean> {
        const checkData: ExistsSignUpDto = new ExistsSignUpDto(signupinfo);
        const existsByEmail: boolean = await this.authRepository.existsByEmail(checkData);
        if (existsByEmail) {
            ResponDtoFactory.createFailRespon(HttpMessages.Failed_AlreadyUser);
        }

        signupinfo.password = await this.hashPassword(signupinfo.password);
        const createUser: boolean = await this.authRepository.createUser(signupinfo);
        if (createUser == false) {
            ResponDtoFactory.createFailRespon(HttpMessages.Failed_CreateUser);
        }
        return true;
    }

    async createToken(signin: SignInDto, useragent: string): Promise<TokenDto> {
        const result_getData: ResultDataBaseDto = await this.authRepository.findOneUser(signin.email);
        if (result_getData.result == false) {
            ResponDtoFactory.createFailRespon(HttpMessages.Failed_UserPassword);
        }

        const bCompare: boolean = await bcrypt.compare(signin.password, result_getData.value.password);
        if (bCompare == false) {
            ResponDtoFactory.createFailRespon(HttpMessages.Failed_UserPassword);
        }

        const accessPayload: AccessTokenPayloadDto = new AccessTokenPayloadDto(
            result_getData.value.instance_id,
            result_getData.value.username,
            UserRole.USER
        );

        const refreshPayload: RefreshTokenPayloadDto = new RefreshTokenPayloadDto(
            result_getData.value.instance_id,
            useragent
        );

        const access_token = await this.createAccessToken(accessPayload);
        const refresh_token = await this.createRefreshToken(refreshPayload);

        const upset_data: boolean = await this.authRepository.upsertRefreshToken(refreshPayload, refresh_token);
        if (upset_data == false) {
            ResponDtoFactory.createFailRespon(HttpMessages.Failed_UserPassword);
        }

        const token_data: TokenDto = new TokenDto(access_token, refresh_token);
        return token_data;

    }

    async createAccessToken(payload: AccessTokenPayloadDto): Promise<string> {
        const plainPayload = instanceToPlain(payload);
        const access_token = await this.jwtService.signAsync(
            plainPayload,
            {
                secret: process.env.JWT_ACCESS_KEY,
                expiresIn: 1000 * Number(process.env.JWT_ACCESS_EXP)
            }
        );
        return access_token;
    }

    async createRefreshToken(payload: RefreshTokenPayloadDto): Promise<string> {
        const plainPayload = instanceToPlain(payload);
        const refreshToken = await this.jwtService.signAsync(
            plainPayload,
            {
                secret: process.env.JWT_RFRESH_KEY,
                expiresIn: 1000 * Number(process.env.JWT_RFRESH_EXP)
            }
        );
        await this.authRepository.upsertRefreshToken(payload, refreshToken);
        return refreshToken;
    }

    async createCSRFToken(payload: CSRFTokenPayloadDto): Promise<string> {
        const plainPayload = instanceToPlain(payload);
        const refreshToken = await this.jwtService.signAsync(
            plainPayload,
            {
                secret: process.env.JWT_CSRF_KEY,
                expiresIn: 1000 * Number(process.env.JWT_CSRF_EXP)
            }
        );
        return refreshToken;
    }

    async updateAccessToken(payload: RefreshTokenPayloadDto): Promise<string> {
        const resultData: ResultDataBaseDto = await this.authRepository.findOneRefreshToken(payload.instance_id);
        let accessPayload: AccessTokenPayloadDto = resultData.value;
        accessPayload.role = UserRole.USER;
        return this.createAccessToken(accessPayload);
    }

    addTimeToDate(date: Date, timeStr: string): number {
        const timeValue = parseInt(timeStr.slice(0, -1));
        const timeUnit = timeStr.slice(-1);
        if (timeUnit === 'h') {
            date.setHours(date.getHours() + timeValue);
        } else if (timeUnit === 'm') {
            date.setMinutes(date.getMinutes() + timeValue);
        } else if (timeUnit === 's') {
            date.setSeconds(date.getSeconds() + timeValue);
        }
        return date.getTime();
    }

    async hashPassword(password: string): Promise<string> {
        const hashedPassword = await bcrypt.hash(password, 7);
        return hashedPassword;
    }

}
