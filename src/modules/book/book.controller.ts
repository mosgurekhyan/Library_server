import { BookService } from './book.service'
import { CreateBookDTO } from './dto/create-book.dto'
import { TakeBookDTO } from './dto/take-book.dto'
import { UpdateBookDTO } from './dto/update-book.dto'

import { Controller, Post, UseInterceptors, UploadedFiles, HttpStatus, HttpException, Body, Get, Delete, Param, Patch } from '@nestjs/common'
import { FileFieldsInterceptor } from '@nestjs/platform-express'

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  @UseInterceptors(FileFieldsInterceptor([ { name: 'img', maxCount: 1 }, { name: 'file', maxCount: 1 } ]))
  async createBook(
    @Body() dto: CreateBookDTO,
    @UploadedFiles() files: { img?: Express.Multer.File[], file?: Express.Multer.File[] }
  ) {
    try {
      return await this.bookService.createBook(dto, files)
    } catch (err) {
      console.log('Error:', err.message)
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.bookService.findAll()
    } catch (err) {
      console.log('Error:', err.message)
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Get('taken/:id')
  async findTakenBooks(@Param('id') id: string) {
    try {
      return await this.bookService.findTakenBooks(id)
    } catch (err) {
      console.log('Error:', err.message)
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Get('subcategory/:subcategory')
  async findWithsubcategory(@Param('subcategory') subcategory: string) {
    try {
      return await this.bookService.findWithsubcategory(subcategory)
    } catch (err) {
      console.log('Error:', err.message)
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Get('random/:quantity')
  async findRandom(@Param('quantity') quantity: number) {
    try {
      return await this.bookService.findRandom(quantity)
    } catch (err) {
      console.log('Error:', err.message)
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.bookService.findOne(id)
    } catch (err) {
      console.log('Error:', err.message)
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Patch('user')
  async takeBook(@Body() dto: TakeBookDTO ) {
    try {
      return await this.bookService.takeBook(dto)
    } catch (err) {
      console.log('Error:', err.message)
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Patch(':id')
  @UseInterceptors(FileFieldsInterceptor([ { name: 'img', maxCount: 1 }, { name: 'file', maxCount: 1 } ]))
  async updateBook(
    @Param('id') id: string,
    @Body() dto: UpdateBookDTO,
    @UploadedFiles() files: { img?: Express.Multer.File[], file?: Express.Multer.File[] }
  ) {
    try {
      return await this.bookService.updateBook(id, dto, files)
    } catch (err) {
      console.log('Error:', err.message)
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Delete(':id')
  async deleteBook(@Param('id') id: string) {
    try {
      return await this.bookService.deleteBook(id)
    } catch (err) {
      console.log('Error:', err.message)
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}