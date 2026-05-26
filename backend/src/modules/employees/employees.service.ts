import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';
import { randomBytes } from 'crypto';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdatePermissionsDto } from './dto/update-permissions.dto';

type StaffUser = {
  sub: string;
  companyId: string;
  role: 'admin' | 'employee';
  type: 'staff';
};

@Injectable()
export class EmployeesService {
  private readonly prisma = new PrismaClient();

  async list(user: StaffUser) {
    await this.ensureCanManageEmployees(user);
    return this.prisma.user.findMany({
      where: { companyId: user.companyId, role: 'employee' },
      orderBy: { createdAt: 'desc' },
      include: { employeePermission: true },
    });
  }

  async create(user: StaffUser, dto: CreateEmployeeDto) {
    await this.ensureCanManageEmployees(user);
    const existing = await this.prisma.user.findFirst({
      where: { companyId: user.companyId, username: dto.username },
    });
    if (existing) {
      throw new ConflictException('Bu kullanici adi zaten kullaniliyor');
    }

    const plainPassword = dto.password || randomBytes(6).toString('base64url');
    const passwordHash = await argon2.hash(plainPassword);
    const employee = await this.prisma.user.create({
      data: {
        companyId: user.companyId,
        fullName: dto.fullName,
        username: dto.username,
        passwordHash,
        role: 'employee',
        isActive: true,
      },
    });

    const permission = await this.prisma.employeePermission.create({
      data: {
        userId: employee.id,
        canViewCustomers: true,
        canCreateCustomers: false,
        canCreateDeliveries: true,
        canEditDeliveries: false,
        canCreatePayments: true,
        canViewReports: true,
        canExportReports: false,
        canManageEmployees: false,
        canManageSettings: false,
      },
    });

    return {
      employee: {
        id: employee.id,
        companyId: employee.companyId,
        fullName: employee.fullName,
        username: employee.username,
        role: employee.role,
        isActive: employee.isActive,
      },
      permission,
      credentials: { username: employee.username, password: plainPassword },
    };
  }

  async updatePermissions(
    user: StaffUser,
    employeeId: string,
    dto: UpdatePermissionsDto,
  ) {
    await this.ensureCanManageEmployees(user);
    const employee = await this.prisma.user.findFirst({
      where: { id: employeeId, companyId: user.companyId, role: 'employee' },
    });
    if (!employee) {
      throw new NotFoundException('Calisan bulunamadi');
    }

    return this.prisma.employeePermission.upsert({
      where: { userId: employee.id },
      create: { userId: employee.id, ...dto },
      update: dto,
    });
  }

  private async ensureCanManageEmployees(user: StaffUser) {
    if (user.role === 'admin') {
      return;
    }
    const permission = await this.prisma.employeePermission.findUnique({
      where: { userId: user.sub },
    });
    if (!permission?.canManageEmployees) {
      throw new UnauthorizedException('Calisan yonetimi yetkiniz yok');
    }
  }
}