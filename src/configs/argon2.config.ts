import { argon2id } from 'argon2'

export const argon2Configs = {
  type: argon2id,
  memoryCost: 2 ** 16,  
  timeCost: 3,
  parallelism: 4
}