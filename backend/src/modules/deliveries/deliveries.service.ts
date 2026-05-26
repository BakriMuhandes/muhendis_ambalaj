import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { CreateDeliveryDto } from './dto/create-delivery.dto';

type StaffUser = {
  sub: string;
  companyId: string;
  role: 'admin' | 'employee';
  type: 'staff';
};

@Injectable()
export class DeliveriesService {
  private readonly prisma = new PrismaClient();

  async list(user: StaffUser) {
    await this.ensureCanViewCustomers(user);
    return this.prisma.delivery.findMany({
      where: { companyId: user.companyId },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(user: StaffUser, dto: CreateDeliveryDto) {
    await this.ensureCanCreateDeliveries(user);
    await this.ensureCustomer(user.companyId, dto.customerId);
    const transactionDate = dto.transactionDate ? new Date(dto.transactionDate) : new Date();

    const items = dto.items.map((item) => {
      const lineTotalUsd = item.quantity * item.unitPriceUsd;
      return {
        productName: item.productName,
        productSize: item.productSize,
        quantity: new Prisma.Decimal(item.quantity),
        unitPriceUsd: new Prisma.Decimal(item.unitPriceUsd),
        lineTotalUsd: new Prisma.Decimal(lineTotalUsd.toFixed(2)),
      };
    });

    const subtotal = items.reduce((acc, cur) => acc + Number(cur.lineTotalUsd), 0);

    const delivery = await this.prisma.delivery.create({
      data: {
        companyId: user.companyId,
        customerId: dto.customerId,
        createdByUserId: user.sub,
        transactionDate,
        exchangeCurrency: dto.exchangeCurrency,
        exchangeRate:
          dto.exchangeRate !== undefined ? new Prisma.Decimal(dto.exchangeRate) : undefined,
        exchangeNote: dto.exchangeNote,
        note: dto.note,
        subtotalUsd: new Prisma.Decimal(subtotal.toFixed(2)),
        items: {
          create: items.map((item) => ({
            ...item,
            customerId: dto.customerId,
          })),
        },
      },
      include: { items: true },
    });

    await this.refreshProductMemories(user, dto.items);

    return delivery;
  }

  async getById(user: StaffUser, deliveryId: string) {
    await this.ensureCanViewCustomers(user);
    const delivery = await this.prisma.delivery.findFirst({
      where: { id: deliveryId, companyId: user.companyId },
      include: { items: true },
    });
    if (!delivery) {
      throw new NotFoundException('Teslimat bulunamadi');
    }
    return delivery;
  }

  async remove(user: StaffUser, deliveryId: string) {
    await this.ensureCanEditDeliveries(user);
    const existing = await this.prisma.delivery.findFirst({
      where: { id: deliveryId, companyId: user.companyId },
    });
    if (!existing) {
      throw new NotFoundException('Teslimat bulunamadi');
    }
    await this.prisma.delivery.delete({ where: { id: deliveryId } });
    return { message: 'Teslimat silindi' };
  }

  private normalize(value: string) {
    return value
      .toLocaleLowerCase('tr-TR')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private async refreshProductMemories(
    user: StaffUser,
    items: Array<{ productName: string; productSize?: string; unitPriceUsd: number }>,
  ) {
    for (const item of items) {
      const normalizedKey = this.normalize(`${item.productName} ${item.productSize || ''}`);
      const existing = await this.prisma.productMemory.findFirst({
        where: { companyId: user.companyId, normalizedKey },
      });

      if (existing) {
        await this.prisma.productMemory.update({
          where: { id: existing.id },
          data: {
            displayName: item.productName,
            sizeLabel: item.productSize,
            lastUsedPriceUsd: new Prisma.Decimal(item.unitPriceUsd),
            usageCount: { increment: 1 },
            lastUsedAt: new Date(),
          },
        });
      } else {
        await this.prisma.productMemory.create({
          data: {
            companyId: user.companyId,
            normalizedKey,
            displayName: item.productName,
            sizeLabel: item.productSize,
            defaultUnit: null,
            lastUsedPriceUsd: new Prisma.Decimal(item.unitPriceUsd),
            usageCount: 1,
            lastUsedAt: new Date(),
            createdByUserId: user.sub,
          },
        });
      }
    }
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
      throw new UnauthorizedException('Teslimatlari goruntuleme yetkiniz yok');
    }
  }

  private async ensureCanCreateDeliveries(user: StaffUser) {
    if (user.role === 'admin') return;
    const permission = await this.prisma.employeePermission.findUnique({
      where: { userId: user.sub },
    });
    if (!permission?.canCreateDeliveries) {
      throw new UnauthorizedException('Teslimat olusturma yetkiniz yok');
    }
  }

  private async ensureCanEditDeliveries(user: StaffUser) {
    if (user.role === 'admin') return;
    const permission = await this.prisma.employeePermission.findUnique({
      where: { userId: user.sub },
    });
    if (!permission?.canEditDeliveries) {
      throw new UnauthorizedException('Teslimat duzenleme yetkiniz yok');
    }
  }
}