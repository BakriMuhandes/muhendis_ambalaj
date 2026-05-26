import { Type } from 'class-transformer';
import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';

export class CreatePaymentDto {
  @IsUUID()
  customerId!: string;

  @IsOptional()
  @IsDateString()
  paymentDate?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0.01)
  amountUsd!: number;

  @IsOptional()
  @IsString()
  @MaxLength(3)
  exchangeCurrency?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  exchangeRate?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  amountExchange?: number;

  @IsOptional()
  @IsString()
  exchangeNote?: string;

  @IsString()
  @MaxLength(50)
  paymentMethod!: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  referenceNo?: string;

  @IsOptional()
  @IsString()
  note?: string;
}