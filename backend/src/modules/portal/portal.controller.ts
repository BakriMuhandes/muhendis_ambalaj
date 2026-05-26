import { Get, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Controller } from '@nestjs/common';
import { Response } from 'express';
import { ReportsExportService } from '../reports/reports-export.service';
import { PortalService } from './portal.service';

@Controller('portal')
@UseGuards(AuthGuard('jwt'))
export class PortalController {
  constructor(
    private readonly portalService: PortalService,
    private readonly reportsExportService: ReportsExportService,
  ) {}

  @Get('dashboard')
  dashboard(@Req() req: any) {
    return this.portalService.dashboard(req.user);
  }

  @Get('deliveries')
  deliveries(@Req() req: any, @Query('from') from?: string, @Query('to') to?: string) {
    return this.portalService.deliveries(req.user, from, to);
  }

  @Get('payments')
  payments(@Req() req: any, @Query('from') from?: string, @Query('to') to?: string) {
    return this.portalService.payments(req.user, from, to);
  }

  @Get('reports/monthly')
  monthly(@Req() req: any, @Query('year') year: string, @Query('month') month: string) {
    return this.portalService.reportsMonthly(req.user, year, month);
  }

  @Get('reports/yearly')
  yearly(@Req() req: any, @Query('year') year: string) {
    return this.portalService.reportsYearly(req.user, year);
  }

  @Get('reports/custom')
  custom(@Req() req: any, @Query('from') from: string, @Query('to') to: string) {
    return this.portalService.reportsCustom(req.user, from, to);
  }

  @Get('reports/export/xlsx')
  exportXlsx(
    @Req() req: any,
    @Res() res: Response,
    @Query('type') type: 'monthly' | 'yearly' | 'custom',
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('year') year?: string,
    @Query('month') month?: string,
  ) {
    return this.portalService
      .export(req.user, type || 'custom', from, to, year, month)
      .then((report) => this.reportsExportService.createXlsx(report))
      .then((buffer) => {
        res.setHeader(
          'Content-Type',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        );
        res.setHeader('Content-Disposition', 'attachment; filename="portal-rapor.xlsx"');
        return res.send(Buffer.from(buffer));
      });
  }

  @Get('reports/export/print')
  exportPrint(
    @Req() req: any,
    @Query('type') type: 'monthly' | 'yearly' | 'custom',
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('year') year?: string,
    @Query('month') month?: string,
  ) {
    return this.portalService.export(req.user, type || 'custom', from, to, year, month);
  }
}