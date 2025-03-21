import { SubcategoryService } from './subcategory.service'
import { SubcategoryController } from './subcategory.controller'
import { SubCategory, SubCategorySchema } from './schema/subcategory'
import { Category, CategorySchema } from '../category/schema/category'
import { Book, BookSchema } from '../book/schema/book'

import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

@Module({
  imports: [
    MongooseModule.forFeature([ 
      { name: SubCategory.name, schema: SubCategorySchema },
      { name: Category.name, schema: CategorySchema },
      { name: Book.name, schema: BookSchema }
    ])
  ],
  controllers: [SubcategoryController],
  providers: [SubcategoryService]
})
export class SubcategoryModule {}