import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';
import { randomBytes } from 'crypto';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

type StaffUser = {
  sub: string;
  companyId: string;
  role: 'admin' | 'employee';
  username: string;
  type: 'staff';
};

@Injectable()
export class CustomersService {
  private readonly prisma = new PrismaClient();

  async list(user: StaffUser) {
    await this.ensureCanViewCustomers(user);
    return this.prisma.customer.findMany({
      where: { companyId: user.companyId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        customerCode: true,
        fullName: true,
        phone: true,
        email: true,
        address: true,
        notes: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async create(user: StaffUser, dto: CreateCustomerDto) {
    await this.ensureCanCreateCustomers(user);

    const customer = await this.prisma.customer.create({
      data: {
        companyId: user.companyId,
        customerCode: dto.customerCode,
        fullName: dto.fullName,
        phone: dto.phone,
        email: dto.email,
        address: dto.address,
        notes: dto.notes,
      },
    });

    const credentials = await this.generateCredentialsForCustomer(
      user.companyId,
      customer.id,
      customer.fullName,
    );

    return { customer, credentials };
  }

  async getById(user: StaffUser, customerId: string) {
    await this.ensureCanViewCustomers(user);
    return this.findCustomerOrThrow(user.companyId, customerId);
  }

  async update(user: StaffUser, customerId: string, dto: UpdateCustomerDto) {
    await this.ensureCanCreateCustomers(user);
    await this.findCustomerOrThrow(user.companyId, customerId);
    return this.prisma.customer.update({
      where: { id: customerId },
      data: {
        customerCode: dto.customerCode,
        fullName: dto.fullName,
        phone: dto.phone,
        email: dto.email,
        address: dto.address,
        notes: dto.notes,
        isActive: dto.isActive,
      },
    });
  }

  async resetCredentials(user: StaffUser, customerId: string) {
    await this.ensureCanCreateCustomers(user);
    const customer = await this.findCustomerOrThrow(user.companyId, customerId);
    return this.generateCredentialsForCustomer(user.companyId, customer.id, customer.fullName);
  }

  async accountSummary(user: StaffUser, customerId: string) {
    await this.ensureCanViewCustomers(user);
    await this.findCustomerOrThrow(user.companyId, customerId);

    const [deliveryAgg, paymentAgg] = await Promise.all([
      this.prisma.deliveryItem.aggregate({
        where: { customerId },
        _sum: { lineTotalUsd: true },
      }),
      this.prisma.payment.aggregate({
        where: { companyId: user.companyId, customerId },
        _sum: { amountUsd: true },
      }),
    ]);

    const totalDebtUsd = Number(deliveryAgg._sum.lineTotalUsd || 0);
    const totalPaymentUsd = Number(paymentAgg._sum.amountUsd || 0);
    const balanceUsd = totalDebtUsd - totalPaymentUsd;

    return {
      customerId,
      totalDebtUsd,
      totalPaymentUsd,
      balanceUsd,
    };
  }

  private async findCustomerOrThrow(companyId: string, customerId: string) {
    const customer = await this.prisma.customer.findFirst({
      where: { id: customerId, companyId },
    });
    if (!customer) {
      throw new NotFoundException('Musteri bulunamadi');
    }
    return customer;
  }

  private normalizeForUsername(text: string) {
    return text
      .toLocaleLowerCase('tr-TR')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '')
      .slice(0, 12);
  }

  private generatePassword() {
    return randomBytes(6).toString('base64url');
  }

  private async generateUniqueUsername(companyId: string, fullName: string) {
    const base = this.normalizeForUsername(fullName) || 'musteri';
    for (let i = 0; i < 1000; i += 1) {
      const suffix = randomBytes(2).toString('hex');
      const username = `${base}${suffix}`;
      const exists = await this.prisma.customerCredential.findUnique({
        where: { username },
      });
      if (!exists) {
        return username;
      }
    }
    throw new ForbiddenException(`Kullanici adi olusturulamadi (${companyId})`);
  }

  private async generateCredentialsForCustomer(
    companyId: string,
    customerId: string,
    fullName: string,
  ) {
    const username = await this.generateUniqueUsername(companyId, fullName);
    const plainPassword = this.generatePassword();
    const passwordHash = await argon2.hash(plainPassword);

    const existing = await this.prisma.customerCredential.findUnique({
      where: { customerId },
    });

    if (existing) {
      await this.prisma.customerCredential.update({
        where: { customerId },
        data: {
          username,
          passwordHash,
          mustChangePassword: true,
          isActive: true,
        },
      });
    } else {
      await this.prisma.customerCredential.create({
        data: {
          customerId,
          username,
          passwordHash,
          mustChangePassword: true,
          isActive: true,
        },
      });
    }

    return { username, password: plainPassword };
  }

  private async ensureCanViewCustomers(user: StaffUser) {
    if (user.role === 'admin') {
      return;
    }
    const permission = await this.prisma.employeePermission.findUnique({
      where: { userId: user.sub },
    });
    if (!permission?.canViewCustomers) {
      throw new UnauthorizedException('Musteri goruntuleme yetkiniz yok');
    }
  }

  private async ensureCanCreateCustomers(user: StaffUser) {
    if (user.role === 'admin') {
      return;
    }
    const permission = await this.prisma.employeePermission.findUnique({
      where: { userId: user.sub },
    });
    if (!permission?.canCreateCustomers) {
      throw new UnauthorizedException('Musteri olusturma yetkiniz yok');
    }
  }
}