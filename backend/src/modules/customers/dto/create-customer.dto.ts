import { IsEmail, IsOptional, IsString, Length, MaxLength } from 'class-validator';

export class CreateCustomerDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  customerCode?: string;

  @IsString()
  @Length(2, 150)
  fullName!: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  phone?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Gecerli bir e-posta adresi giriniz' })
  @MaxLength(150)
  email?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}