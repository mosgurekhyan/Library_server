import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { RedisClientType, createClient } from 'redis'

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: RedisClientType

  async onModuleInit () {
    this.client = createClient({
      url: process.env.REDIS_SERVER_URL
    })

    this.client.on('error', err => console.error('Redis Client Error', err))
    await this.client.connect()
  }

  async onModuleDestroy () {
    await this.client.quit()
  }

  async set(key: string, value: string) {
    await this.client.set(key, value, { EX: 60 })
  }
  

  async get (key: string) {
    return this.client.get(key)
  }

  async del (key: string) {
    return this.client.del(key)
  }
}