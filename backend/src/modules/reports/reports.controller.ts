import {
  Controller,
  Get,
  Header,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { RolesGuard } from '../../common/guards/roles.guard';
import { ReportsExportService } from './reports-export.service';
import { ReportsService } from './reports.service';

@Controller('reports')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ReportsController {
  constructor(
    private readonly reportsService: ReportsService,
    private readonly reportsExportService: ReportsExportService,
  ) {}

  @Get('customer-summary')
  customerSummary(@Req() req: any, @Query('customerId') customerId: string) {
    return this.reportsService.customerSummary(req.user, customerId);
  }

  @Get('customer-ledger')
  customerLedger(
    @Req() req: any,
    @Query('customerId') customerId: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.reportsService.customerLedger(req.user, customerId, from, to);
  }

  @Get('monthly')
  monthly(
    @Req() req: any,
    @Query('customerId') customerId: string,
    @Query('year') year: string,
    @Query('month') month: string,
  ) {
    return this.reportsService.monthly(req.user, customerId, year, month);
  }

  @Get('yearly')
  yearly(
    @Req() req: any,
    @Query('customerId') customerId: string,
    @Query('year') year: string,
  ) {
    return this.reportsService.yearly(req.user, customerId, year);
  }

  @Get('custom')
  custom(
    @Req() req: any,
    @Query('customerId') customerId: string,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    return this.reportsService.custom(req.user, customerId, from, to);
  }

  @Get('export/xlsx')
  async exportXlsx(
    @Req() req: any,
    @Res() res: Response,
    @Query('customerId') customerId: string,
    @Query('type') type: 'monthly' | 'yearly' | 'custom',
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('year') year?: string,
    @Query('month') month?: string,
  ) {
    const report = await this.reportsService.exportPrint(
      req.user,
      customerId,
      type || 'custom',
      from,
      to,
      year,
      month,
    );
    const buffer = await this.reportsExportService.createXlsx(report);
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', 'attachment; filename=\"rapor.xlsx\"');
    return res.send(Buffer.from(buffer));
  }

  @Get('export/print')
  @Header('Content-Type', 'application/json; charset=utf-8')
  exportPrint(
    @Req() req: any,
    @Query('customerId') customerId: string,
    @Query('type') type: 'monthly' | 'yearly' | 'custom',
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('year') year?: string,
    @Query('month') month?: string,
  ) {
    return this.reportsService.exportPrint(
      req.user,
      customerId,
      type || 'custom',
      from,
      to,
      year,
      month,
    );
  }
}