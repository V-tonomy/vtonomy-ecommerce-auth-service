import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export enum EUserRole {
  USER,
  ADMIN,
}

export class AuthRegisterDTO {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  name: string;

  @IsEnum(EUserRole)
  role: EUserRole;
}

export class AuthLoginDTO {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsEnum(EUserRole)
  role: EUserRole;
}

export class AuthRefreshTokenDTO {
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}

export class AuthVerifyTokenDTO {
  @IsString()
  @IsNotEmpty()
  token: string;
}

export class AuthVerifyCodeDTO {
  @IsString()
  @IsNotEmpty()
  code: string;
}

export class AuthPayload {
  id: string;
  email: string;
  name: string;
  role: EUserRole;
}
