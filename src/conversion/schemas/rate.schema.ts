import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RateDocument = Rate & Document;

export enum Countries {
	'United States' = 'USD',
	'United Kingdom' = 'GBP',
	'India' = 'INR',
	'Australia' = 'AUD',
	'Singapore' = 'SGD',
	'Europe' = 'EUR',
}

@Schema()
export class Rate {
	@Prop({ required: true, enum: Countries })
	from: string;

	@Prop({ required: true, enum: Countries })
	to: string;

	@Prop({ required: true })
	rate: number;

	@Prop({ required: true })
	date: Date;
}

export const RateSchema = SchemaFactory.createForClass(Rate);
