import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentsService } from './payments.service';

@Controller('payments')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  list(@Req() req: any) {
    return this.paymentsService.list(req.user);
  }

  @Post()
  @Roles('admin', 'employee')
  create(@Req() req: any, @Body() dto: CreatePaymentDto) {
    return this.paymentsService.create(req.user, dto);
  }

  @Get(':paymentId')
  getById(@Req() req: any, @Param('paymentId') paymentId: string) {
    return this.paymentsService.getById(req.user, paymentId);
  }

  @Delete(':paymentId')
  @Roles('admin', 'employee')
  remove(@Req() req: any, @Param('paymentId') paymentId: string) {
    return this.paymentsService.remove(req.user, paymentId);
  }
}