import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config();
export const typePgORMCofing: TypeOrmModuleOptions = {
    type: 'postgres',
    host: String(process.env.DB_HOST),
    port: Number(process.env.DB_PORT),
    username: String(process.env.DB_USERNAME),
    password: String(process.env.DB_PASSWORD),
    database: String(process.env.DB_DATABASE),
    entities: [path.join(__dirname, '..', String(process.env.DB_ENTITY_PATH))], // TypeORM entity 들을 여기에 추가
    synchronize: Boolean(process.env.DB_SYNCHRONIZE), // 개발 환경에서만 사용 (production 환경에서는 false 추천)
}