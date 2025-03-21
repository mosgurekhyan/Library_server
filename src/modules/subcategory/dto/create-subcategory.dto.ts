import { IsString, IsArray, IsOptional, IsMongoId, IsNotEmpty } from "class-validator"

export class CreateSubcategoryDTO {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsString()
  categoryId: string

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  books?: string[]
}