import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

type StaffUser = {
  sub: string;
  companyId: string;
  role: 'admin' | 'employee';
  type: 'staff';
};

@Injectable()
export class ProductMemoriesService {
  private readonly prisma = new PrismaClient();

  async suggest(user: StaffUser, query: string, limit = 10) {
    await this.ensureCanCreateDeliveries(user);
    const normalizedQuery = this.normalize(query);
    if (!normalizedQuery) {
      return [];
    }

    return this.prisma.productMemory.findMany({
      where: {
        companyId: user.companyId,
        normalizedKey: { startsWith: normalizedQuery },
      },
      orderBy: [{ usageCount: 'desc' }, { lastUsedAt: 'desc' }],
      take: Math.min(Math.max(limit, 1), 20),
    });
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

  private async ensureCanCreateDeliveries(user: StaffUser) {
    if (user.role === 'admin') return;
    const permission = await this.prisma.employeePermission.findUnique({
      where: { userId: user.sub },
    });
    if (!permission?.canCreateDeliveries) {
      throw new UnauthorizedException('Urun onerisi icin teslimat yetkisi gerekir');
    }
  }
}