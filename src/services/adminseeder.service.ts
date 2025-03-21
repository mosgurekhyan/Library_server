import { argon2Configs } from 'src/configs/argon2.config'
import { User, UserDocument } from 'src/modules/user/schema/user'

import { Injectable, OnModuleInit } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { hash } from 'argon2'
import { Model } from 'mongoose'

@Injectable()
export class AdminSeederService implements OnModuleInit {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async onModuleInit() {
    await this.createAdminUser()
  }

  async createAdminUser() {
    const adminExists = await this.userModel.findOne({ role: process.env.ADMIN_ROLE })
    if (!adminExists) {
      const admin = new this.userModel({
        fullName: process.env.ADMIN_NAME,
        password: await hash(process.env.ADMIN_PASSWORD, argon2Configs),
        role: process.env.ADMIN_ROLE,
        email: process.env.ADMIN_EMAIL, 
        profession: process.env.ADMIN_PROFESSION,
        educationalInstitution: process.env.ADMIN_EDUCATIONAL_INSTITUTION,
        verified: true
      }) 
      
      await admin.save()
    } 
  }
}