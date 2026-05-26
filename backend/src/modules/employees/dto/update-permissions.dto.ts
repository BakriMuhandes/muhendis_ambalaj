import { IsBoolean, IsOptional } from 'class-validator';

export class UpdatePermissionsDto {
  @IsOptional()
  @IsBoolean()
  canViewCustomers?: boolean;

  @IsOptional()
  @IsBoolean()
  canCreateCustomers?: boolean;

  @IsOptional()
  @IsBoolean()
  canCreateDeliveries?: boolean;

  @IsOptional()
  @IsBoolean()
  canEditDeliveries?: boolean;

  @IsOptional()
  @IsBoolean()
  canCreatePayments?: boolean;

  @IsOptional()
  @IsBoolean()
  canViewReports?: boolean;

  @IsOptional()
  @IsBoolean()
  canExportReports?: boolean;

  @IsOptional()
  @IsBoolean()
  canManageEmployees?: boolean;

  @IsOptional()
  @IsBoolean()
  canManageSettings?: boolean;
}