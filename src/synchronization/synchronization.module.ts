import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConversionModule } from 'src/conversion/conversion.module';
import { SynchronizationService } from './synchronization.service';

@Module({
	providers: [SynchronizationService],
	imports: [HttpModule, ConversionModule],
})
export class SynchronizationModule {}
