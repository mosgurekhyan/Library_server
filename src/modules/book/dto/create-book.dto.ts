import { Transform } from 'class-transformer'
import { IsString, IsNumber, IsOptional, IsNotEmpty } from 'class-validator'

export class CreateBookDTO {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsString()
  isbn: string

  @IsNotEmpty()
  @IsString()
  author: string

  @Transform(({ value }) => Number(value)) 
  @IsNotEmpty()
  @IsNumber()
  date: number

  @Transform(({ value }) => Number(value)) 
  @IsNotEmpty()
  @IsNumber()
  pages: number

  @IsNotEmpty()
  @IsString()
  category: string

  @IsNotEmpty()
  @IsString()
  type: string

  @IsNotEmpty()
  @IsString()
  subcategory: string

  @IsNotEmpty()
  @IsString()
  description: string

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  img: string
  
  @Transform(({ value }) => Number(value)) 
  @IsOptional()
  @IsNumber()
  quantity?: number

  @IsOptional()
  @IsNumber()
  taken?: number

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  file?: string

  @IsNotEmpty()
  @IsString()
  subcategoryId: string
}