import { UserService } from './user.service'
import { MessageUserDTO } from './dto/message-user.dto'

import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('message')
  async sendMessage (@Body() dto: MessageUserDTO) {
    try {
      return await this.userService.sendMessage(dto)
    } catch (err) {
      console.log('Error:', err.message)
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}