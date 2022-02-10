import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConversionModule } from './conversion/conversion.module';
import { SynchronizationModule } from './synchronization/synchronization.module';

@Module({
	imports: [
		ConfigModule.forRoot(),
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => {
				Logger.debug(
					`MongoDB URL: ${configService.get('MONGODB_URI')}`,
					'MongoDB',
				);

				return {
					uri: configService.get('MONGODB_URI'),
					useNewUrlParser: true,
					useUnifiedTopology: true,
				};
			},
			inject: [ConfigService],
		}),
		ScheduleModule.forRoot(),
		ConversionModule,
		SynchronizationModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
