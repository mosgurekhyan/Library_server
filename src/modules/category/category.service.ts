import { InjectModel } from '@nestjs/mongoose'
import { CreateCategoryDTO } from './dto/create-category.dto'
import { UpdateCategoryDTO } from './dto/update-category.dto'
import { Category, CategoryDocument } from './schema/category'
import { SubCategory, SubCategoryDocument } from '../subcategory/schema/subcategory'
import { Book, BookDocument } from '../book/schema/book'

import { BadRequestException, Injectable } from '@nestjs/common'
import { Model } from 'mongoose'
import * as fs from 'fs'
import * as path from 'path'

@Injectable()
export class CategoryService {
  constructor (
    @InjectModel(Category.name) private readonly categoryModel: Model<CategoryDocument>,
    @InjectModel(SubCategory.name) private readonly subCategoryModel: Model<SubCategoryDocument>,
    @InjectModel(Book.name) private readonly bookModel: Model<BookDocument>
  ) {}

  async createCategory (dto: CreateCategoryDTO) {
    const { name } = dto
    
    const existingCategory = await this.findByName(name)
    
    if (existingCategory) throw new BadRequestException('category with this name already exists!')
    
    const category = new this.categoryModel({ ...dto })
    await category.save() 

    return category    
  }

  async findAll () {
    const categories = await this.categoryModel.find()
    return categories
  }

  async findWithsubcategories () {
    return await this.categoryModel.find().populate({ path: 'subcategories', model: SubCategory.name })
  }

  async findOne(id: string) {
    const category = await this.categoryModel.findById(id)
    return category
  }

  async findByName (name: string) {
    const category = await this.categoryModel.findOne({ name })
    return category
  } 

  async updateCategory (id: string, dto: UpdateCategoryDTO) {
    const existingCategory = await this.findByName(dto.name)

    if (existingCategory) {
      throw new BadRequestException('category name duplicated!')
    }
    const updatedCategory = await this.categoryModel.findByIdAndUpdate(id, dto, { new: true })
    return updatedCategory
  }

  async deleteCategory (id: string) {
    const category = await this.categoryModel
    .findById(id)
    .populate({
      path: 'subcategories',
      model: SubCategory.name,
      populate: {
        path: 'books',
        model: Book.name
      }
    })
  
    if (!category) {
      throw new Error("category not found")
    }
    for (const subCategory of category.subcategories || []) {
      for (const book of subCategory?.books || []) {
        if (book.img) {
          const imgPath = path.join(process.cwd(), book.img)
          if (fs.existsSync(imgPath)) {
            fs.unlinkSync(imgPath)
          }
        }
        if (book.file) {
          const filePath = path.join(process.cwd(), book.file)
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath)
          }
        }
        const bookDoc = book as BookDocument
        await this.bookModel.findByIdAndDelete(bookDoc._id)
      }
  
      const subCategoryDoc = subCategory as SubCategoryDocument 
      await this.subCategoryModel.findByIdAndDelete(subCategoryDoc._id)
    }
  
    await this.categoryModel.findByIdAndDelete(id)
    return id
  }
}