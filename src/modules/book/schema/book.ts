import { User } from "src/modules/user/schema/user"

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { HydratedDocument, Types } from "mongoose"

export type BookDocument = HydratedDocument<Book>

@Schema()
export class Book {
  @Prop({ type: String, required: true })
  name: string

  @Prop({ type: String, required: true })
  isbn: string

  @Prop({ type: String, required: true })
  author: string

  @Prop({ type: Number, required: true })
  date: number

  @Prop({ type: Number, required: true })
  pages: number

  @Prop({ type: String, required: true })
  category: string

  @Prop({ type: String, required: true })
  subcategory: string

  @Prop({ type: String, required: true })
  description: string

  @Prop({ type: String, default: null })
  img?: string

  @Prop({ type: String, required: true })
  type: string
  
  @Prop({ type: Number, default: 0 })
  quantity?: number
  
  @Prop({ type: Number, default: 0 })
  taken?: number

  @Prop({ type: String, default: null })
  file?: string

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  users: User[]
}

export const BookSchema = SchemaFactory.createForClass(Book)