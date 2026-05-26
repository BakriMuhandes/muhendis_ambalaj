import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { DeliveriesService } from './deliveries.service';

@Controller('deliveries')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class DeliveriesController {
  constructor(private readonly deliveriesService: DeliveriesService) {}

  @Get()
  list(@Req() req: any) {
    return this.deliveriesService.list(req.user);
  }

  @Post()
  @Roles('admin', 'employee')
  create(@Req() req: any, @Body() dto: CreateDeliveryDto) {
    return this.deliveriesService.create(req.user, dto);
  }

  @Get(':deliveryId')
  getById(@Req() req: any, @Param('deliveryId') deliveryId: string) {
    return this.deliveriesService.getById(req.user, deliveryId);
  }

  @Delete(':deliveryId')
  @Roles('admin', 'employee')
  remove(@Req() req: any, @Param('deliveryId') deliveryId: string) {
    return this.deliveriesService.remove(req.user, deliveryId);
  }
}