import { PartialType } from '@nestjs/mapped-types'
import { CreateSubcategoryDTO } from './create-subcategory.dto'

export class UpdateSubcategoryDTO extends PartialType(CreateSubcategoryDTO) {}