import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { firstValueFrom } from 'rxjs';
import { ConversionService } from 'src/conversion/conversion.service';
import { CreateRateDto } from 'src/conversion/dto/create-rate.dto';
import { Countries } from 'src/conversion/schemas/rate.schema';

@Injectable()
export class SynchronizationService {
	private readonly logger = new Logger(SynchronizationService.name);

	constructor(
		private readonly httpService: HttpService,
		private readonly conversionService: ConversionService,
	) {}

	@Cron('0 0 * * * *')
	async deleteHistoricalData() {
		try {
			await this.conversionService.deleteOldData();
		} catch (e) {
			this.logger.error(e);
		}
	}

	@Cron('10 * * * * *')
	async synchronize() {
		try {
			const baseCountry = Countries['United States'];
			const targetCountries = Object.keys(Countries).filter(
				(country) => Countries[country] !== baseCountry,
			);

			const pairs = targetCountries.map((country) => {
				return {
					from: baseCountry,
					to: Countries[country],
					query: `${baseCountry}${Countries[country]}`,
				};
			});

			const query = pairs.map((pair) => pair.query).join(',');

			const apiUrl = 'https://www.freeforexapi.com/api/live';
			const response = await firstValueFrom(
				this.httpService.get(apiUrl, {
					params: {
						pairs: query,
					},
				}),
			);
			const rates = response.data.rates;

			this.logger.debug(`${JSON.stringify(rates)}`);

			const usdToInr = rates['USDINR'];
			const inrToUsdAmount = 1 / usdToInr.rate;
			const india = Countries['India'];
			const destCountries = Object.values(Countries).filter(
				(country) =>
					country !== india && country != Countries['United States'],
			);

			const entries: CreateRateDto[] = [];

			entries.push({
				from: Countries.India,
				to: Countries['United States'],
				rate: inrToUsdAmount,
				date: new Date(usdToInr.timestamp * 1000),
			});

			destCountries.forEach((country) => {
				entries.push({
					from: Countries.India,
					to: country,
					rate: inrToUsdAmount * rates[`USD${country}`].rate,
					date: new Date(rates[`USD${country}`].timestamp * 1000),
				});
			});
			this.conversionService.createMany(entries);
		} catch (e) {
			this.logger.error(e);
		}
	}
}
