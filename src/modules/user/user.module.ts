import { UserService } from './user.service'
import { UserController } from './user.controller'
import { User, UserSchema } from '../user/schema/user'
import { EmailService } from 'src/services/email.service'
import { AdminSeederService } from 'src/services/adminseeder.service'

import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

@Module({
  imports: [
    MongooseModule.forFeature([ 
      { name: User.name, schema: UserSchema }
    ])
  ],
  controllers: [UserController],
  providers: [UserService, EmailService, AdminSeederService],
  exports: [MongooseModule]
})
export class UserModule {}