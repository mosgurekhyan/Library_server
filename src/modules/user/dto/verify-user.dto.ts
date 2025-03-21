import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator"

export class VerifyUserDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsString()
  @IsNotEmpty()
  otp: string

  @IsBoolean()
  @IsOptional()
  confirmation?: boolean
}