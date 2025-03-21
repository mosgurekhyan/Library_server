import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { HydratedDocument } from "mongoose"

export type UserDocument = HydratedDocument<User>

@Schema()
export class User {
  @Prop({ type: String, required: true })
  fullName: string

  @Prop({ type: String, required: true })
  email: string

  @Prop({ type: String, required: true })
  password: string

  @Prop({ type: Boolean, default: false })
  verified: boolean

  @Prop({ type: String, required: true })
  role: string

  @Prop({ type: String, required: true })
  profession: string

  @Prop({ type: String, required: true })
  educationalInstitution: string
}

export const UserSchema = SchemaFactory.createForClass(User)