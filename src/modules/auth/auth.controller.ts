import { AuthService } from './auth.service'
import { CreateUserDTO } from '../user/dto/create-user.dto'
import { UpdateUserDTO } from '../user/dto/update-user.dto';
import { VerifyUserDTO } from '../user/dto/verify-user.dto'
import { LoginUserDTO } from '../user/dto/login-user.dto'

import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Res, Req } from '@nestjs/common'
import { Request, Response } from 'express'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async createUser (@Body() dto: CreateUserDTO) {
    try {
      return await this.authService.createUser(dto)
    } catch (err) {
      console.log('Error:', err.message)
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
  
  @Post('refresh')
  async refreshToken (@Req() req: Request, @Res() res: Response) {
    try {
      return await this.authService.refreshToken(req, res)
    } catch (err) {
      console.log('Error:', err.message)
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Patch('verify')
  async verifyUser (@Body() dto: VerifyUserDTO, @Res() res: Response) {
    try {
      return await this.authService.verifyUser(dto, res)
    } catch (err) {
      console.log('Error:', err.message)
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Patch('change-password')
  async changePassword (@Body() dto: UpdateUserDTO) {
    try {
      return await this.authService.changePassword(dto)
    } catch (err) {
      console.log('Error:', err.message)
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Post('resend/:email') 
  async resendOtp (@Param('email') email: string) {
    try {
      return await this.authService.resendOtp(email)
    } catch (err) {
      console.log('Error:', err.message)
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Post('login')
  async loginUser (@Body() dto: LoginUserDTO, @Res() res: Response) {
    try {
      return await this.authService.loginUser(dto, res)
    } catch (err) {
      console.log('Login error:', err.message)
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}