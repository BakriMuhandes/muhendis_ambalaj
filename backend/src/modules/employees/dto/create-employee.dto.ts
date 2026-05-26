import { IsOptional, IsString, Length, MinLength } from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  @Length(2, 150)
  fullName!: string;

  @IsString()
  @Length(4, 100)
  username!: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;
}