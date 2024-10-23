// import { TypeOrmModuleOptions } from '@nestjs/typeorm';
// import * as path from 'path';
import { Injectable } from '@nestjs/common';
import { Client } from 'pg';
import { ResultDataBaseDto } from '../../common/dto/database.dto';

@Injectable()
export class DatabaseService {
    private client: Client;
    constructor() {
        this.client = new Client({
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
        });
        this.connect();
    }

    async connect() {
        try {
            await this.client.connect(); // 연결 완료까지 대기
            console.log('Database connected successfully'); // 연결 성공 로그
        } catch (error) {
            console.error('Database connection error:', error.message);
            throw new Error('Database connection failed');
        }
    }

    async query(sql: string, params: any[] = []) {
        try {
            console.debug('Executing SQL:', sql, 'with parameters:', JSON.stringify(params, null, 2));

            const result = await this.client.query(sql, params);
            return new ResultDataBaseDto(true, result.rows);
        } catch (error) {
            return new ResultDataBaseDto(false, `ERROR: ${error.message}`);
        }
    }

    async insertQuery(table: string, dtodata: any) {
        try {
            const keys = Object.keys(dtodata);
            const datas = Object.values(dtodata);
            const length = keys.length;
            const values = Array.from({ length }, (_, i) => `$${i + 1}`);
            const sql = `INSERT INTO ${table} (${keys.join(',')}) VALUES (${values.join(',')})`;
            const result = await this.client.query(sql, datas);
            return new ResultDataBaseDto(true, 'success');
        } catch (error) {
            return new ResultDataBaseDto(false, `${error.message}`);
        }
    }

    async insertReturnQuery(table: string, dtodata: any, retrundto: any = null) {
        try {
            const keys = Object.keys(dtodata);
            const datas = Object.values(dtodata);
            const length = keys.length;
            const values = Array.from({ length }, (_, i) => `$${i + 1}`);
            const return_keys = retrundto == null ? ['*'] : Object.keys(retrundto);
            const sql = `INSERT INTO ${table} (${keys.join(',')}) VALUES (${values.join(',')}) RETURNING ${return_keys.join(',')};`;
            const result = await this.client.query(sql, datas);
            return new ResultDataBaseDto(true, result.rows[0]);
        } catch (error) {
            return new ResultDataBaseDto(false, `${error.message}`);
        }
    }
}



// export const typePgORMConfig: TypeOrmModuleOptions = {
//     type: 'postgres',
//     host: String(process.env.DB_HOST),
//     port: Number(process.env.DB_PORT),
//     username: String(process.env.DB_USERNAME),
//     password: String(process.env.DB_PASSWORD),
//     database: String(process.env.DB_DATABASE),
//     entities: [path.join(__dirname, '..', String(process.env.DB_ENTITY_PATH))], // TypeORM entity 들을 여기에 추가
//     synchronize: Boolean(process.env.DB_SYNCHRONIZE), // 개발 환경에서만 사용 (production 환경에서는 false 추천)
// }