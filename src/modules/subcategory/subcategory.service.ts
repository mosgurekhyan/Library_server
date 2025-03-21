import { Book, BookDocument } from '../book/schema/book'
import { Category, CategoryDocument } from '../category/schema/category'
import { CreateSubcategoryDTO } from './dto/create-subcategory.dto'
import { UpdateSubcategoryDTO } from './dto/update-subcategory.dto'
import { SubCategory, SubCategoryDocument } from './schema/subcategory'

import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import * as fs from 'fs'
import * as path from 'path'

@Injectable()
export class SubcategoryService {
  constructor (
    @InjectModel(SubCategory.name) private readonly subCategoryModel: Model<SubCategoryDocument>,
    @InjectModel(Category.name) private readonly categoryModel: Model<CategoryDocument>,
    @InjectModel(Book.name) private readonly bookModel: Model<BookDocument>
  ) {}
  
  async createSubCategory (dto: CreateSubcategoryDTO) {
    const { name, categoryId } = dto
    
    const existingSubCategory = await this.findByName(name)
    
    if (existingSubCategory) throw new BadRequestException('sub category with this name already exists!')
    
    const subCategory = new this.subCategoryModel({ ...dto })
    await subCategory.save()
    await this.categoryModel.findByIdAndUpdate(
      categoryId,
      { $push: { subcategories: subCategory._id } }
    )

    return subCategory    
  }

  async findAll () {
    const subCategories = await this.subCategoryModel.find()
    return subCategories
  }

  async findOne(id: string) {
    const subCategory = await this.subCategoryModel.findById(id)
    return subCategory
  }

  async findByName (name: string) {
    const subCategory = await this.subCategoryModel.findOne({ name })
    return subCategory
  }

  async updateSubCategory (id: string, dto: UpdateSubcategoryDTO) {
    const existingSubCategory = await this.findByName(dto.name)

    if (existingSubCategory) {
      throw new BadRequestException('sub category name duplicated!')
    }
    const updatedSubCategory = await this.subCategoryModel.findByIdAndUpdate(id, dto, { new: true })
    return updatedSubCategory
  }

  async findWithbooks () {
    return await this.subCategoryModel.find().populate({ path: 'books', model: Book.name })
  }

  async deleteSubCategory (id: string) {
    const subcategory = await this.subCategoryModel
    .findById(id)
    .populate({
      path: 'books',
      model: Book.name
    })
  
    if (!subcategory) {
      throw new Error("subcategory not found")
    }
    for (const book of subcategory.books || []) {
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
  
    await this.subCategoryModel.findByIdAndDelete(id)
    return id
  }
}