import { CategoryService } from './category.service'
import { CategoryController } from './category.controller'
import { Category, CategorySchema } from './schema/category'
import { SubCategory, SubCategorySchema } from '../subcategory/schema/subcategory'
import { Book, BookSchema } from '../book/schema/book'

import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

@Module({
  imports: [
    MongooseModule.forFeature([ 
      { name: Category.name, schema: CategorySchema },
      { name: SubCategory.name, schema: SubCategorySchema },
      { name: Book.name, schema: BookSchema }
    ])
  ],
  controllers: [CategoryController],
  providers: [CategoryService]
})
export class CategoryModule {}