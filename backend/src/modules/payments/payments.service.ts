import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { CreatePaymentDto } from './dto/create-payment.dto';

type StaffUser = {
  sub: string;
  companyId: string;
  role: 'admin' | 'employee';
  type: 'staff';
};

@Injectable()
export class PaymentsService {
  private readonly prisma = new PrismaClient();

  async list(user: StaffUser) {
    await this.ensureCanViewCustomers(user);
    return this.prisma.payment.findMany({
      where: { companyId: user.companyId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(user: StaffUser, dto: CreatePaymentDto) {
    await this.ensureCanCreatePayments(user);
    await this.ensureCustomer(user.companyId, dto.customerId);
    const paymentDate = dto.paymentDate ? new Date(dto.paymentDate) : new Date();

    const payment = await this.prisma.payment.create({
      data: {
        companyId: user.companyId,
        customerId: dto.customerId,
        enteredByUserId: user.sub,
        paymentDate,
        amountUsd: new Prisma.Decimal(dto.amountUsd),
        exchangeCurrency: dto.exchangeCurrency,
        exchangeRate:
          dto.exchangeRate !== undefined ? new Prisma.Decimal(dto.exchangeRate) : undefined,
        amountExchange:
          dto.amountExchange !== undefined ? new Prisma.Decimal(dto.amountExchange) : undefined,
        exchangeNote: dto.exchangeNote,
        paymentMethod: dto.paymentMethod,
        referenceNo: dto.referenceNo,
        note: dto.note,
      },
    });

    const balance = await this.calculateBalance(user.companyId, dto.customerId);

    return { payment, balance };
  }

  async getById(user: StaffUser, paymentId: string) {
    await this.ensureCanViewCustomers(user);
    const payment = await this.prisma.payment.findFirst({
      where: { id: paymentId, companyId: user.companyId },
    });
    if (!payment) {
      throw new NotFoundException('Odeme bulunamadi');
    }
    return payment;
  }

  async remove(user: StaffUser, paymentId: string) {
    await this.ensureCanCreatePayments(user);
    const existing = await this.prisma.payment.findFirst({
      where: { id: paymentId, companyId: user.companyId },
    });
    if (!existing) {
      throw new NotFoundException('Odeme bulunamadi');
    }
    await this.prisma.payment.delete({ where: { id: paymentId } });
    return { message: 'Odeme silindi' };
  }

  async calculateBalance(companyId: string, customerId: string) {
    const [deliveryAgg, paymentAgg] = await Promise.all([
      this.prisma.deliveryItem.aggregate({
        where: { customerId },
        _sum: { lineTotalUsd: true },
      }),
      this.prisma.payment.aggregate({
        where: { companyId, customerId },
        _sum: { amountUsd: true },
      }),
    ]);

    const totalDebtUsd = Number(deliveryAgg._sum.lineTotalUsd || 0);
    const totalPaymentUsd = Number(paymentAgg._sum.amountUsd || 0);
    return {
      customerId,
      totalDebtUsd,
      totalPaymentUsd,
      balanceUsd: totalDebtUsd - totalPaymentUsd,
    };
  }

  private async ensureCustomer(companyId: string, customerId: string) {
    const customer = await this.prisma.customer.findFirst({
      where: { id: customerId, companyId, isActive: true },
    });
    if (!customer) {
      throw new NotFoundException('Musteri bulunamadi');
    }
  }

  private async ensureCanViewCustomers(user: StaffUser) {
    if (user.role === 'admin') return;
    const permission = await this.prisma.employeePermission.findUnique({
      where: { userId: user.sub },
    });
    if (!permission?.canViewCustomers) {
      throw new UnauthorizedException('Odeme goruntuleme yetkiniz yok');
    }
  }

  private async ensureCanCreatePayments(user: StaffUser) {
    if (user.role === 'admin') return;
    const permission = await this.prisma.employeePermission.findUnique({
      where: { userId: user.sub },
    });
    if (!permission?.canCreatePayments) {
      throw new UnauthorizedException('Odeme olusturma yetkiniz yok');
    }
  }
}