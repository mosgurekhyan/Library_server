import { MessageUserDTO } from 'src/modules/user/dto/message-user.dto'

import * as nodemailer from 'nodemailer'
import { Injectable } from '@nestjs/common'

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS
      }
    })
  }

  async sendOtpEmail(email: string, otp: string) {
    const mailOptions = {
      to: email, 
      subject: 'Your OTP Code', 
      html: `<p>Your OTP code is: <b>${otp}</b></p>`
    }

    try {
      await this.transporter.sendMail(mailOptions)
    } catch (error) {
      console.error('Error sending OTP email:', error)
      throw new Error('Failed to send OTP email')
    }
  }

  async sendEmail(dto: MessageUserDTO) {
    const { email, subject, name, message } = dto
    const mailOptions = {
      to: email, 
      subject, 
      html: `<p>${message}</p>`
    }

    try {
      await this.transporter.sendMail(mailOptions)
    } catch (error) {
      console.error('Error sending OTP email:', error)
      throw new Error('Failed to send OTP email')
    }
  }
}