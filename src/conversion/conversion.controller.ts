import { Controller, Get, Logger, Param, Query } from '@nestjs/common';
import { ConversionService } from './conversion.service';
import { Countries } from './schemas/rate.schema';

@Controller()
export class ConversionController {
	private logger: Logger = new Logger(ConversionController.name);

	constructor(private readonly conversionService: ConversionService) {}

	@Get()
	async getConversion(@Query('to') to: Countries): Promise<any> {
		return await this.conversionService.findFor(Countries.India, to);
	}
}
