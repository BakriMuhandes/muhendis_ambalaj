import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

class CreateDeliveryItemDto {
  @IsString()
  productName!: string;

  @IsOptional()
  @IsString()
  productSize?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0.001)
  quantity!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  unitPriceUsd!: number;
}

export class CreateDeliveryDto {
  @IsUUID()
  customerId!: string;

  @IsOptional()
  @IsDateString()
  transactionDate?: string;

  @IsOptional()
  @IsString()
  exchangeCurrency?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  exchangeRate?: number;

  @IsOptional()
  @IsString()
  exchangeNote?: string;

  @IsOptional()
  @IsString()
  note?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateDeliveryItemDto)
  items!: CreateDeliveryItemDto[];
}