import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common'
import * as jwt from 'jsonwebtoken'
import { Request, Response } from 'express'
import { JwtPayload } from 'jsonwebtoken'

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<Request>()
    const res = context.switchToHttp().getResponse<Response>()

    const { refreshToken, accessToken } = req.cookies

    if (!accessToken) {
      if (refreshToken) {
        const decoded = await this.verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY) as JwtPayload
        // console.log('decoded',decoded)
        if (decoded) {
          const newAccessToken = jwt.sign({ email: decoded.email }, process.env.ACCESS_TOKEN_SECRET_KEY, { expiresIn: '15m' })
          res.cookie('accessToken', newAccessToken, { 
            httpOnly: true, 
            secure: true, 
            maxAge: 900000, 
            sameSite: 'none'
          })
          return true 
        } else {
          throw new HttpException('Unauthorized Exception', HttpStatus.UNAUTHORIZED)
        }
      } else {
        throw new HttpException('LogoutRequired', HttpStatus.UNAUTHORIZED)
      }
    } else {
      const decoded = await this.verifyToken(accessToken, process.env.SECRET_KEY)
      if (decoded) {
        return true
      } else {
        console.error('Access denied: Invalid accessToken')
        throw new HttpException('Access denied: Invalid accessToken', HttpStatus.UNAUTHORIZED)
      }
    }
  }

  private verifyToken(token: string, secret: string) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, secret, (err, decoded) => {
        if (err) {
          reject(err)
        } else {
          resolve(decoded)
        }
      })
    })
  }
}