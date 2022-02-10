import { IsDate, IsEnum, IsNumber } from 'class-validator';
import { Countries } from '../schemas/rate.schema';

export class CreateRateDto {
	@IsEnum(Countries)
	from: string;

	@IsEnum(Countries)
	to: string;

	@IsNumber()
	rate: number;

	@IsDate()
	date: Date;
}
