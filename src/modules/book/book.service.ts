import { CreateBookDTO } from './dto/create-book.dto'
import { UpdateBookDTO } from './dto/update-book.dto'
import { Book, BookDocument } from './schema/book'
import { SubCategory, SubCategoryDocument } from '../subcategory/schema/subcategory'
import { TakeBookDTO } from './dto/take-book.dto'

import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import * as fs from 'fs'
import * as path from 'path'

@Injectable()
export class BookService {
  constructor (
    @InjectModel(Book.name) private readonly bookModel: Model<BookDocument>,
    @InjectModel(SubCategory.name) private readonly subCategoryModel: Model<SubCategoryDocument>
  ) {}

  async createBook (dto: CreateBookDTO, files: { img?: Express.Multer.File[], file?: Express.Multer.File[] }) {
    try {  
      let imgPath = ''
      let filePath = ''
  
      if (files.img && files.img.length > 0) {
        const imgFile = files.img[0]
        imgPath = `uploads/${imgFile.filename}`
      }
  
      if (files.file && files.file.length > 0) {
        const file = files.file[0]
        filePath = `uploads/${file.filename}`
      }
  
      const newBook = new this.bookModel({
        ...dto,
        img: imgPath,
        file: filePath || null
      })
  
      await newBook.save()
      await this.subCategoryModel.findByIdAndUpdate(
        dto.subcategoryId,
        { $push: { books: newBook._id } }
      )
      return newBook
    } catch (err) {
      console.error('Error in createBook:', err)
      throw err
    }
  }

  async findAll () {
    const books = await this.bookModel.find()
    return books
  }

  async deleteBook (id: string) {
    try {
      const book = await this.bookModel.findById(id)
      const uploadsPath = path.join(process.cwd())
  
      if (book.img) {
        const oldImgPath = path.join(uploadsPath, book.img)
        try {
          fs.unlinkSync(oldImgPath)
        } catch (err) {
          console.error('Error deleting image:', err)
        }
      }
  
      if (book.file) {
        const oldFilePath = path.join(uploadsPath, book.file)
        try {
          fs.unlinkSync(oldFilePath)
        } catch (err) {
          console.error('Error deleting file:', err)
        }
      }
  
      await this.bookModel.findByIdAndDelete(id)
      
      return id
    } catch (err) {
      console.error('Error in deleteBook:', err)
      throw new BadRequestException('Failed to delete book')
    }
  } 

  async updateBook(id: string, dto: UpdateBookDTO, files: { img?: Express.Multer.File[], file?: Express.Multer.File[] }) {
    try {
      const book = await this.bookModel.findById(id)
      let imgPath = book.img
      let filePath = book.file
  
      if (files.img && files.img.length > 0) {
        const imgFile = files.img[0]
        imgPath = `uploads/${imgFile.filename}`
        
        const oldImgPath = path.join(process.cwd(), book.img) 
        console.log('oldImgPath', oldImgPath)
        
        if (fs.existsSync(oldImgPath)) {
          fs.unlinkSync(oldImgPath)
        }
      }
  
      if (files.file && files.file.length > 0) {
        const file = files.file[0]
        filePath = `uploads/${file.filename}`
        
        const oldFilePath = path.join(process.cwd(), book.file)
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath) 
        }
      }
  
      const updatedBook = await this.bookModel.findByIdAndUpdate(
        id,
        { 
          ...dto, 
          img: imgPath, 
          file: filePath 
        },
        { new: true }
      )
  
      return updatedBook
    } catch (err) {
      console.error('Error in updateBook:', err)
      throw new BadRequestException('Failed to update book')
    }
  }

  async findOne (id: string) {
    return await this.bookModel.findById(id)
  }

  async findWithsubcategory (subcategory: string) {
    return await this.bookModel.find({ subcategory })
  }

  async findRandom (quantity: number) {
    return await this.bookModel.aggregate([{ $sample: { size: quantity } }])
  }

  async takeBook (dto: TakeBookDTO) {
    const { id, bookId } = dto
    const book = await this.bookModel.findById(bookId)

    const userExists = book.users.find(userId => userId.toString() === id)
    if (userExists) {
      return { message: 'user has already taken this book!' }
    }

    if (book.taken < book.quantity) {
      const updatedBook = await this.bookModel.findByIdAndUpdate(bookId, {
        $push: { users: id },
        $inc: { taken: 1 }
      }, { new: true })
      return updatedBook
    }
    return { message: 'book quantity expires!' }
  }

  async findTakenBooks (id: string) {
    return await this.bookModel.find({ users: id })
  }
}