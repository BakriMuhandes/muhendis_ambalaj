import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdatePermissionsDto } from './dto/update-permissions.dto';
import { EmployeesService } from './employees.service';

@Controller('employees')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get()
  @Roles('admin', 'employee')
  list(@Req() req: any) {
    return this.employeesService.list(req.user);
  }

  @Post()
  @Roles('admin', 'employee')
  create(@Req() req: any, @Body() dto: CreateEmployeeDto) {
    return this.employeesService.create(req.user, dto);
  }

  @Patch(':employeeId/permissions')
  @Roles('admin', 'employee')
  updatePermissions(
    @Req() req: any,
    @Param('employeeId') employeeId: string,
    @Body() dto: UpdatePermissionsDto,
  ) {
    return this.employeesService.updatePermissions(req.user, employeeId, dto);
  }
}