import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { HydratedDocument, Types } from "mongoose"
import { SubCategory } from "src/modules/subcategory/schema/subcategory"

export type CategoryDocument = HydratedDocument<Category>

@Schema()
export class Category {
  @Prop({ type: String, required: true })
  name: string

  @Prop({ type: [{ type: Types.ObjectId, ref: 'SubCategory' }] })
  subcategories: SubCategory[]
}

export const CategorySchema = SchemaFactory.createForClass(Category)