import { IsString, IsArray, IsOptional, IsMongoId } from "class-validator"

export class CreateCategoryDTO {
  @IsString()
  name: string

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  subcategories?: string[]
}