import { IsDate, IsNotEmpty, IsNumber } from 'class-validator';

export class RoleDto {
  @IsNotEmpty()
  @IsNumber()
  level: string;

  @IsNotEmpty()
  @IsNumber()
  userId: number;
}
