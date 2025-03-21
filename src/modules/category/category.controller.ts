import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common'
import { CategoryService } from './category.service'
import { CreateCategoryDTO } from './dto/create-category.dto'
import { UpdateCategoryDTO } from './dto/update-category.dto'

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async createCategory (@Body() dto: CreateCategoryDTO) {
    try {
      return await this.categoryService.createCategory(dto)
    } catch (err) {
      console.log('Error:', err.message)
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.categoryService.findAll()
    } catch (err) {
      console.log('Error:', err.message)
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Get('with-subcategories')
  async findWithsubcategories() {
    try {
      return await this.categoryService.findWithsubcategories()
    } catch (err) {
      console.log('Error:', err.message)
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.categoryService.findOne(id)
    } catch (err) {
      console.log('Error:', err.message)
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Patch(':id')
  async updateCategory(@Param('id') id: string, @Body() dto: UpdateCategoryDTO) {
    try {
      return await this.categoryService.updateCategory(id, dto)
    } catch (err) {
      console.log('Error:', err.message)
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Delete(':id')
  async deleteCategory(@Param('id') id: string) {
    try {
      return await this.categoryService.deleteCategory(id)
    } catch (err) {
      console.log('Error:', err.message)
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}