import { SubcategoryService } from './subcategory.service'
import { CreateSubcategoryDTO } from './dto/create-subcategory.dto'
import { UpdateSubcategoryDTO } from './dto/update-subcategory.dto'

import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common'

@Controller('subcategory')
export class SubcategoryController {
  constructor(private readonly subCategoryService: SubcategoryService) {}

  @Post()
  async createSubCategory (@Body() dto: CreateSubcategoryDTO) {
    try {
      return await this.subCategoryService.createSubCategory(dto)
    } catch (err) {
      console.log('Error:', err.message)
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }  
  }

  @Get()
  async findAll() {
    try {
      return await this.subCategoryService.findAll()
    } catch (err) {
      console.log('Error:', err.message)
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Get('with-books')
  async findWithbooks() {
    try {
      return await this.subCategoryService.findWithbooks()
    } catch (err) {
      console.log('Error:', err.message)
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.subCategoryService.findOne(id)
    } catch (err) {
      console.log('Error:', err.message)
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Patch(':id')
  async updateSubCategory(@Param('id') id: string, @Body() dto: UpdateSubcategoryDTO) {
    try {
      return await this.subCategoryService.updateSubCategory(id, dto)
    } catch (err) {
      console.log('Error:', err.message)
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Delete(':id')
  async deleteSubCategory(@Param('id') id: string) {
    try {
      return await this.subCategoryService.deleteSubCategory(id)
    } catch (err) {
      console.log('Error:', err.message)
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}