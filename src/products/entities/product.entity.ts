import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Product extends Document {
  _id: Types.ObjectId;
  @Prop({ required: true })
  name: string;
  @Prop()
  description: string;
  @Prop({ type: Number })
  price: number;
  @Prop({ type: Number })
  stock: number;
  @Prop()
  image: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
