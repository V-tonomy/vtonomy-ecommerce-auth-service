import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class TokenMongo {
  @Prop({ required: true })
  _id: string;

  @Prop({ required: true })
  token: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export type TokenDocument = TokenMongo & Document;
export const TokenSchema = SchemaFactory.createForClass(TokenMongo);
