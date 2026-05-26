import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/roles.guard';
import { ProductMemoriesService } from './product-memories.service';

@Controller('product-memories')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ProductMemoriesController {
  constructor(private readonly productMemoriesService: ProductMemoriesService) {}

  @Get('suggest')
  suggest(@Req() req: any, @Query('q') q = '', @Query('limit') limit = '10') {
    const parsedLimit = Number(limit) || 10;
    return this.productMemoriesService.suggest(req.user, q, parsedLimit);
  }
}