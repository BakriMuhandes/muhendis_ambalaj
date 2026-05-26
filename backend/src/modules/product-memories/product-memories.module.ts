import { Module } from '@nestjs/common';
import { ProductMemoriesController } from './product-memories.controller';
import { ProductMemoriesService } from './product-memories.service';

@Module({
  controllers: [ProductMemoriesController],
  providers: [ProductMemoriesService],
  exports: [ProductMemoriesService],
})
export class ProductMemoriesModule {}