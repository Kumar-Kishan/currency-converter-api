import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRateDto } from './dto/create-rate.dto';
import { Countries, invalidCountry, Rate } from './schemas/rate.schema';

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
		this.logger.log(`deleting rates older than ${date}`);
		return await this.rateModel.deleteMany(query);
	}

	async findFor(from: Countries, to: Countries) {
		const query = {
			from,
			to,
		};
		if (invalidCountry(to)) {
			return await this.rateModel.aggregate([
				{
					$match: {
						from,
					},
				},
				{
					$sort: {
						date: -1,
					},
				},
				{
					$group: {
						_id: '$to',
						from: { $first: '$from' },
						to: { $first: '$to' },
						rate: { $first: '$rate' },
						date: { $first: '$date' },
					},
				},
				{
					$project: {
						_id: 0,
					},
				},
			]);
		} else {
			return await this.rateModel.findOne(query).sort({ date: -1 });
		}
	}
}
