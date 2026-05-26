import { Module } from '@nestjs/common';
import { ReportsModule } from '../reports/reports.module';
import { PortalController } from './portal.controller';
import { PortalService } from './portal.service';

@Module({
  imports: [ReportsModule],
  controllers: [PortalController],
  providers: [PortalService],
})
export class PortalModule {}