import { DatabaseService } from 'src/config/database/database.service';
import { ExistsSignUpDto, SingUpDto, ReturnSignInDto } from './dto/users.dto';
import { ResultDataBaseDto } from 'src/common/dto/database.dto';
import { RefreshTokenPayloadDto } from './dto/token.dto';
import { IReturnFindOneRefresh } from './interface/auth.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthRepository {
    constructor(private readonly databaseService: DatabaseService) { }

    async existsByEmail(existsSignup: ExistsSignUpDto): Promise<boolean> {
        const sql = `SELECT EXISTS (
                        SELECT 1
                        FROM
                            misa.users as u
                        WHERE
                            u.email = $1 )`;
        const result = await this.databaseService.query(sql, [existsSignup.email]);
        return result.value[0].exists;
    }

    async createUser(signup: SingUpDto): Promise<boolean> {
        const sql = `INSERT INTO misa.users 
                        (username, password, email )
                    VALUES
                        ($1, $2, $3)`;
        const result = await this.databaseService.query(sql, [signup.username, signup.password, signup.email]);
        return result.result;
    }

    async upsertRefreshToken(refreshPayload: RefreshTokenPayloadDto, token: string): Promise<boolean> {
        const sql = `
                    INSERT INTO misa.jwt_token (instance_id, user_agent, refresh_token)
                    VALUES ($1, $2, $3)
                    ON CONFLICT (instance_id) DO UPDATE
                    SET user_agent = $4, refresh_token = $5`;
        const result = await this.databaseService.query(sql, [refreshPayload.instance_id, refreshPayload.useragent, token, refreshPayload.useragent, token]);
        return result.result;
    }


    async findOneUser(email: string): Promise<ResultDataBaseDto> {
        const sql = `
                    SELECT
                        u.instance_id,
                        u.username,
                        u."password"
                    FROM
                        misa.users as u
                    WHERE
                        u.email = $1
                    LIMIT 1`;
        const result = await this.databaseService.query(sql, [email]);
        result.value = result.value[0] as ReturnSignInDto;
        return result;
    }

    async findOneRefreshToken(instance_id: string): Promise<ResultDataBaseDto> {
        const sql = `
                    SELECT
                        u.instance_id,
                        u.username
                    FROM
                         misa.jwt_token as t
                    JOIN
                        misa.users as u ON  u.instance_id = t.instance_id
                    LIMIT 1`;
        const result = await this.databaseService.query(sql, [instance_id]);
        result.value = result.value[0] as IReturnFindOneRefresh;
        return result;
    }

    async findRefreshToken(token: string, useragent: string): Promise<ResultDataBaseDto> {
        const sql = `
                    SELECT
                    FROM
                        misa.jwt_token as t
                    WHERE
                        t.refresh_token = $1
                        AND t.user_agent = $2
                    LIMIT 1`;
        const result = await this.databaseService.query(sql, [token, useragent]);
        result.value = result.value[0] as ReturnSignInDto;
        return result;
    }
}