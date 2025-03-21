import { BookService } from './book.service'
import { BookController } from './book.controller'
import { Book, BookSchema } from './schema/book'

import * as fs from 'fs'
import * as path from 'path'
import { MulterModule } from '@nestjs/platform-express'
import { MongooseModule } from '@nestjs/mongoose'
import { diskStorage } from 'multer'
import { Module } from '@nestjs/common'
import { SubCategory, SubCategorySchema } from '../subcategory/schema/subcategory'

@Module({
  imports: [
    MongooseModule.forFeature([ 
      { name: Book.name, schema: BookSchema },
      { name: SubCategory.name, schema: SubCategorySchema }
    ]),
    MulterModule.register({
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadDir = path.join(process.cwd(), 'uploads')
          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true })
          }
          cb(null, uploadDir)
        },
        filename: (req, file, cb) => {
          cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname))
        }
      })
    })
  ],
  controllers: [BookController],
  providers: [BookService]
})
export class BookModule {}