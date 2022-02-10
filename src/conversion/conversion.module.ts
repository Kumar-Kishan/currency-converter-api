import { Module } from '@nestjs/common';
import { ConversionService } from './conversion.service';
import { ConversionController } from './conversion.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Countries, Rate, RateSchema } from './schemas/rate.schema';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Rate.name, schema: RateSchema }]),
	],
	controllers: [ConversionController],
	providers: [ConversionService],
	exports: [ConversionService],
})
export class ConversionModule {}
