import { MessageUserDTO } from './dto/message-user.dto'
import { EmailService } from 'src/services/email.service'

import { Injectable } from '@nestjs/common'

@Injectable()
export class UserService {
  constructor (private readonly emailService: EmailService) {}

  async sendMessage (dto: MessageUserDTO) {
    await this.emailService.sendEmail(dto)
    return 'message has been sent'
  }
}