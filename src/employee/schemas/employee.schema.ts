import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EmployeeDocument = Employee & Document;

@Schema()
export class Employee {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  status: string;

  @Prop({ required: true })
  designation: string;

  @Prop({ required: true })
  department: string;

  @Prop({ required: true })
  role: string;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);
