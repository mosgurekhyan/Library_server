import { CreateUserDTO } from '../user/dto/create-user.dto'
import { User, UserDocument } from '../user/schema/user'
import { argon2Configs } from 'src/configs/argon2.config'
import { generateOTP } from 'src/utils/otp'
import { RedisService } from 'src/services/redis.service'
import { EmailService } from 'src/services/email.service'
import { UpdateUserDTO } from '../user/dto/update-user.dto'
import { VerifyUserDTO } from '../user/dto/verify-user.dto'
import { LoginUserDTO } from '../user/dto/login-user.dto'

import { InjectModel } from '@nestjs/mongoose'
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { Model } from 'mongoose'
import { hash, verify } from 'argon2'
import * as jwt from 'jsonwebtoken'
import { JwtPayload } from 'jsonwebtoken'
import { Request, Response } from 'express'

@Injectable()
export class AuthService {
  constructor (
    private readonly redisService: RedisService,
    private readonly emailService: EmailService,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>
  ) {}
  
  async createUser(dto: CreateUserDTO) {
    const { fullName, password, role, email, profession, educationalInstitution } = dto

    const existingUser = await this.findByEmail(email)

    if (existingUser) throw new BadRequestException('email already exists!')

    const user = new this.userModel({
      fullName, 
      email,
      educationalInstitution,
      profession,
      role: email === process.env.ADMIN_EMAIL ? process.env.ADMIN_ROLE : role,
      password: await hash(password, argon2Configs)
    })
    await user.save()

    const otp = await generateOTP()
    await this.emailService.sendOtpEmail(email, otp)
    await this.redisService.set(email, otp)
    return email
  }

  async verifyUser (dto: VerifyUserDTO, res: Response) {
    const { email, otp, confirmation } = dto
    const user = await this.findByEmail(email)
    const data = await this.redisService.get(email)

    if (!data) {
      return res.json({ message: 'OTP expires!' })
    } else if (data === otp) {
      if (confirmation) {
        return res.json({ confirmation: true })
      } else {
        user.verified = true
        await user.save()
        const userObj = user.toObject()
        delete userObj.password
  
        const tokens = await this.issueTokens(user.email)
        const { accessToken, refreshToken } = tokens
  
        res
        .cookie('accessToken', accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 900000,
          sameSite: 'none'
        })
        .cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: true,
          maxAge: 86400000 * 15,
          sameSite: 'none'
        })
        return res.json({ user: userObj, message: 'user successfully verified' })
      }
    } else {
      return res.json({ message: 'incorrect otp code' })
    }
  }

  async resendOtp (email: string) {
    const otp = await generateOTP()
    // console.log('otp',otp)
    await this.emailService.sendOtpEmail(email, otp)
    await this.redisService.set(email, otp)
    return 'verification code has been sent'
  }

  async loginUser (dto: LoginUserDTO, res: Response) {
    const user = await this.validateUser(dto)
    const tokens = await this.issueTokens(user.email)
    const { accessToken, refreshToken } = tokens

    res
    .cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      maxAge: 900000,
      sameSite: 'none'
    })
    .cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 86400000 * 15,
      sameSite: 'none'
    })

    return res.json(user)
  }

  async validateUser (dto: LoginUserDTO) {
    const { email, password } = dto
    const user = await this.findByEmail(email)
    if (!user) throw new NotFoundException('user not found')

    const isValid = await verify(user.password, password)
    if (!isValid) throw new UnauthorizedException('invalid email or password')
    if (!user.verified) throw new UnauthorizedException('please verify email')

    const userObj = user.toObject()
    delete userObj.password

    return userObj
  }

  async issueTokens (email: string) {
    const accessToken = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET_KEY, { expiresIn: '15m' })
    const refreshToken = jwt.sign({ email }, process.env.REFRESH_TOKEN_SECRET_KEY, { expiresIn: '15d' })
    return { accessToken, refreshToken }
  }

  async findByEmail (email: string) {
    const user = await this.userModel.findOne({ email })
    return user
  }

  async changePassword (dto: UpdateUserDTO) {
    const { email, password } = dto 
    const user = await this.findByEmail(email)
    const hashedPassword = await hash(password, argon2Configs)

    user.password = hashedPassword
    await user.save()
  
    return true
  }

  async refreshToken (req: Request, res: Response) {
    const { refreshToken } = req.cookies
    if (!refreshToken) {
      return res.status(401).send('Access Denied. No refresh token provided.')
    } else {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY) as JwtPayload
      const newAccessToken = jwt.sign({ email: decoded.email }, process.env.ACCESS_TOKEN_PRIVATE_KEY, { expiresIn: '15m' })
      res.cookie('accessToken', newAccessToken, { httpOnly: true, secure: true, maxAge: 900000 })
      res.send('New access token successfully created.')
    }
  }
}