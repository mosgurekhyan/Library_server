import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator"

export class CreateUserDTO {
  @IsString()
  @IsNotEmpty()
  fullName: string

  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsString()
  @IsNotEmpty()
  // @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string

  @IsOptional()
  @IsBoolean()
  verified?: boolean

  @IsString()
  @IsNotEmpty()
  role: string

  @IsString()
  @IsNotEmpty()
  profession: string

  @IsString()
  @IsNotEmpty()
  educationalInstitution: string
}