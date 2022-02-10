import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRateDto } from './dto/create-rate.dto';
import { Rate } from './schemas/rate.schema';

@Injectable()
export class ConversionService {
	private logger = new Logger(ConversionService.name);

	constructor(@InjectModel(Rate.name) private rateModel: Model<Rate>) {}

	async createMany(entries: CreateRateDto[]) {
		try {
			await this.rateModel.insertMany(entries);
		} catch (e) {
			this.logger.error(e);
		}
	}

	async deleteOldData() {
		//delete all rates older than 1 hour
		const date = new Date();
		date.setHours(date.getHours() - 1);
		const query = {
			date: { $lt: date },
		};
		return await this.rateModel.deleteMany(query);
	}

	async findFor(from: string, to: string) {
		const query = {
			from,
			to,
		};
		return await this.rateModel.findOne(query).sort({ date: -1 });
	}
}
