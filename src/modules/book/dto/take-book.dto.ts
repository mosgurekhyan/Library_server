import { IsString, IsNotEmpty } from 'class-validator'

export class TakeBookDTO {
  @IsNotEmpty()
  @IsString()
  id: string

  @IsNotEmpty()
  @IsString()
  bookId: string
}