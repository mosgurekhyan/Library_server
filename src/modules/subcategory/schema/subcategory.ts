import { Book } from "src/modules/book/schema/book"

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { HydratedDocument, Types } from "mongoose"

export type SubCategoryDocument = HydratedDocument<SubCategory>

@Schema()
export class SubCategory {
  @Prop({ type: String, required: true })
  name: string

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Book' }] })
  books: Book[]
}

export const SubCategorySchema = SchemaFactory.createForClass(SubCategory)