import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { UserModule } from '../user/user.module'
import { RedisService } from 'src/services/redis.service'

import { Module } from '@nestjs/common'
import { EmailService } from 'src/services/email.service'

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [AuthService, RedisService, EmailService]
})
export class AuthModule {}