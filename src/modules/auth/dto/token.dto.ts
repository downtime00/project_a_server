import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';
import { IBase } from '../../../common/interface/base.interface';
import { IAccessPayload, ICSRFPayload, IRefreshPayload } from '../interface/auth.interface';

export class TokenTableDto implements IBase, IAccessPayload {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsUUID()
  instance_id: string;

  @IsNotEmpty()
  @IsUUID()
  username: string;

  @IsNotEmpty()
  @IsNumber()
  role: number;

  @IsNotEmpty()
  @IsNumber()
  iat: number;

  @IsNotEmpty()
  @IsUUID()
  access_token: string;

  @IsNotEmpty()
  @IsUUID()
  refresh_token: string;

  @IsNotEmpty()
  @IsNumber()
  refresh_exp: number;
}

export class AccessTokenPayloadDto implements IAccessPayload {
  @IsNotEmpty()
  @IsString()
  instance_id: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsNumber()
  role: number;

  constructor(sub: string, username: string, role: number) {
    this.instance_id = sub;
    this.username = username;
    this.role = role;
  }
}

export class RefreshTokenPayloadDto implements IRefreshPayload {
  @IsNotEmpty()
  @IsString()
  instance_id: string;

  @IsNotEmpty()
  @IsString()
  useragent: string;

  constructor(sub: string, agent: string) {
    this.instance_id = sub;
    this.useragent = agent;
  }
}

export class CSRFTokenPayloadDto implements ICSRFPayload {
  @IsNotEmpty()
  @IsString()
  useragent: string;

  constructor(agent: string) {
    this.useragent = agent;
  }
}

export class TokenDto {
  @IsNotEmpty()
  access: string;
  @IsNotEmpty()
  refresh: string;
  constructor(access: string, refresh: string) {
    this.access = access;
    this.refresh = refresh;
  }
}