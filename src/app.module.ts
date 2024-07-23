import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

//# import config folder
import { typePgORMCofing } from './config/database.config';
//# import modules folder 
import { AuthModule } from './module/auth/auth.module';
import { UserModule } from './module/user/user.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    //url
    AuthModule,
    UserModule,
    //settings
    TypeOrmModule.forRoot(typePgORMCofing),
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }