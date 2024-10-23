import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';

@Module({
    providers: [DatabaseService],  // 서비스를 제공자로 등록
    exports: [DatabaseService],    // 다른 모듈에서 사용할 수 있도록 내보냄
})
export class DatabaseModule { }