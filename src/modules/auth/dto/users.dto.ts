import { UUID } from 'crypto';
import { IBaseDate, IBasePublic, IBaseUser } from '../../../common/interface/base.interface';

import { IsEmail, IsNotEmpty, IsString, Length, IsDate, IsNumber, IsUUID, IsBoolean } from 'class-validator';
import { IAccessPayload, IReturnCreateUser, IReturnSignIn, ISignIn, ISignUp } from '../interface/auth.interface';


/**
 * SPDX-FileCopyrightText : ©2024 downtime00 <downtime.0000@gmail.com>
 * SPDX-License-Identifier: BSD-3-Clause
 * 
 *  서버 내부용 데이터 형식 
 * 
 *  ### DTO 명 참고 ###
 *  {TableName}TableDto       - 기본 테이블 정보
 *  {API}Dto                  - 사용자한테 받은 데이터
 *  Check{API}Dto             - 데이터 삽입전 중복 체크 데이터
 *  Respon{API}Dto            - 사용자에게 전달될 데이터
 *  
 */


/**
 * @table users 
 */
export class UsersTableDto implements IBasePublic, IBaseDate {
  @IsNotEmpty()
  @IsNumber()
  readonly id: number;

  @IsNotEmpty()
  @IsUUID()
  readonly instance_id: string;

  @IsDate()
  readonly createdAt: Date;

  @IsDate()
  readonly updatedAt: Date;

  @IsString()
  readonly alias: string;

  @IsNotEmpty()
  @IsString()
  readonly username: string;

  @IsNotEmpty()
  @IsString()
  readonly password: string;

  @IsNotEmpty()
  @IsNumber()
  readonly status: number;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsNumber()
  readonly gorup_id: number;

  @IsDate()
  readonly deletedAt: Date;

  @IsDate()
  readonly bannedAt: Date;
}

export class SingUpDto implements ISignUp {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsEmail()
  @IsString()
  email: string;
}

export class ExistsSignUpDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  constructor(singup: SingUpDto) {
    this.email = singup.email;
  }
}

export class SignInDto implements ISignIn {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class ReturnSignInDto implements IReturnSignIn {
  @IsNotEmpty()
  @IsString()
  instance_id: string;
  @IsNotEmpty()
  @IsString()
  username: string;
  @IsNotEmpty()
  @IsString()
  password: string;

}

export class ReturnCreateUserDto implements IReturnCreateUser {
  @IsNotEmpty()
  @IsString()
  token: string;
}

export class ReturnFindOneRefreshDto implements IAccessPayload {
  @IsNotEmpty()
  @IsString()
  instance_id: string;
  @IsNotEmpty()
  @IsString()
  username: string;
  @IsString()
  role: number;
}





