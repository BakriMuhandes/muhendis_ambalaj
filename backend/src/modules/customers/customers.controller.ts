import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomersService } from './customers.service';

@Controller('customers')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  list(@Req() req: any) {
    return this.customersService.list(req.user);
  }

  @Post()
  @Roles('admin', 'employee')
  create(@Req() req: any, @Body() dto: CreateCustomerDto) {
    return this.customersService.create(req.user, dto);
  }

  @Get(':customerId')
  getById(@Req() req: any, @Param('customerId') customerId: string) {
    return this.customersService.getById(req.user, customerId);
  }

  @Patch(':customerId')
  @Roles('admin', 'employee')
  update(
    @Req() req: any,
    @Param('customerId') customerId: string,
    @Body() dto: UpdateCustomerDto,
  ) {
    return this.customersService.update(req.user, customerId, dto);
  }

  @Post(':customerId/reset-credentials')
  @Roles('admin', 'employee')
  resetCredentials(@Req() req: any, @Param('customerId') customerId: string) {
    return this.customersService.resetCredentials(req.user, customerId);
  }

  @Get(':customerId/account-summary')
  getAccountSummary(@Req() req: any, @Param('customerId') customerId: string) {
    return this.customersService.accountSummary(req.user, customerId);
  }
}