import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ReportsService } from '../reports/reports.service';

type CustomerUser = {
  sub: string;
  customerId: string;
  companyId: string;
  username: string;
  type: 'customer';
};

@Injectable()
export class PortalService {
  private readonly prisma = new PrismaClient();

  constructor(private readonly reportsService: ReportsService) {}

  async dashboard(user: CustomerUser) {
    this.ensureCustomerToken(user);
    const [deliveryAgg, paymentAgg, latestDelivery, latestPayment] = await Promise.all([
      this.prisma.delivery.aggregate({
        where: { companyId: user.companyId, customerId: user.customerId },
        _sum: { subtotalUsd: true },
      }),
      this.prisma.payment.aggregate({
        where: { companyId: user.companyId, customerId: user.customerId },
        _sum: { amountUsd: true },
      }),
      this.prisma.delivery.findFirst({
        where: { companyId: user.companyId, customerId: user.customerId },
        orderBy: { transactionDate: 'desc' },
      }),
      this.prisma.payment.findFirst({
        where: { companyId: user.companyId, customerId: user.customerId },
        orderBy: { paymentDate: 'desc' },
      }),
    ]);

    const totalDebtUsd = Number(deliveryAgg._sum.subtotalUsd || 0);
    const totalPaymentUsd = Number(paymentAgg._sum.amountUsd || 0);
    const lastDate =
      latestDelivery && latestPayment
        ? new Date(
            Math.max(latestDelivery.transactionDate.getTime(), latestPayment.paymentDate.getTime()),
          )
        : latestDelivery?.transactionDate || latestPayment?.paymentDate || null;

    return {
      guncelBorcUsd: Number((totalDebtUsd - totalPaymentUsd).toFixed(2)),
      toplamTeslimatUsd: totalDebtUsd,
      toplamOdemeUsd: totalPaymentUsd,
      sonIslemTarihi: lastDate ? lastDate.toISOString().slice(0, 10) : null,
    };
  }

  async deliveries(user: CustomerUser, from?: string, to?: string) {
    this.ensureCustomerToken(user);
    return this.prisma.delivery.findMany({
      where: {
        companyId: user.companyId,
        customerId: user.customerId,
        ...(from || to
          ? {
              transactionDate: {
                ...(from ? { gte: new Date(from) } : {}),
                ...(to ? { lte: new Date(to) } : {}),
              },
            }
          : {}),
      },
      include: { items: true },
      orderBy: { transactionDate: 'desc' },
    });
  }

  async payments(user: CustomerUser, from?: string, to?: string) {
    this.ensureCustomerToken(user);
    return this.prisma.payment.findMany({
      where: {
        companyId: user.companyId,
        customerId: user.customerId,
        ...(from || to
          ? {
              paymentDate: {
                ...(from ? { gte: new Date(from) } : {}),
                ...(to ? { lte: new Date(to) } : {}),
              },
            }
          : {}),
      },
      orderBy: { paymentDate: 'desc' },
    });
  }

  reportsMonthly(user: CustomerUser, year: string, month: string) {
    this.ensureCustomerToken(user);
    const staffLikeUser = { sub: user.sub, companyId: user.companyId, role: 'admin', type: 'staff' } as any;
    return this.reportsService.monthly(staffLikeUser, user.customerId, year, month);
  }

  reportsYearly(user: CustomerUser, year: string) {
    this.ensureCustomerToken(user);
    const staffLikeUser = { sub: user.sub, companyId: user.companyId, role: 'admin', type: 'staff' } as any;
    return this.reportsService.yearly(staffLikeUser, user.customerId, year);
  }

  reportsCustom(user: CustomerUser, from: string, to: string) {
    this.ensureCustomerToken(user);
    const staffLikeUser = { sub: user.sub, companyId: user.companyId, role: 'admin', type: 'staff' } as any;
    return this.reportsService.custom(staffLikeUser, user.customerId, from, to);
  }

  export(user: CustomerUser, type: 'monthly' | 'yearly' | 'custom', from?: string, to?: string, year?: string, month?: string) {
    this.ensureCustomerToken(user);
    const staffLikeUser = { sub: user.sub, companyId: user.companyId, role: 'admin', type: 'staff' } as any;
    return this.reportsService.exportPrint(staffLikeUser, user.customerId, type, from, to, year, month);
  }

  private ensureCustomerToken(user: CustomerUser) {
    if (!user?.customerId || user.type !== 'customer') {
      throw new UnauthorizedException('Musteri tokeni gerekli');
    }
  }
}