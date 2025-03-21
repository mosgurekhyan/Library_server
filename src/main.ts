import { AppModule } from './app.module'

import { NestFactory } from '@nestjs/core'
import * as logger from 'morgan'
import * as cookieParser from 'cookie-parser'
import helmet from 'helmet'
import { ValidationPipe } from '@nestjs/common'
import * as express from 'express'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix('api')
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }))
  app.enableCors({
    origin: process.env.DOMAIN,
    methods: [ 'GET', 'POST',  'PATCH', 'PUT', 'DELETE' ],
    credentials: true
  })     

  app.use('/api/uploads', express.static('uploads', { dotfiles: 'allow' }))
  app.use(helmet())
  app.use(logger('dev'))
  app.use(cookieParser())
  await app.listen(process.env.SERVER_PORT, () => console.log('\n☘️  Server connected!\n'))
}
bootstrap()  