"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveriesService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
let DeliveriesService = class DeliveriesService {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    async list(user) {
        await this.ensureCanViewCustomers(user);
        return this.prisma.delivery.findMany({
            where: { companyId: user.companyId },
            include: { items: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async create(user, dto) {
        await this.ensureCanCreateDeliveries(user);
        await this.ensureCustomer(user.companyId, dto.customerId);
        const transactionDate = dto.transactionDate ? new Date(dto.transactionDate) : new Date();
        const items = dto.items.map((item) => {
            const lineTotalUsd = item.quantity * item.unitPriceUsd;
            return {
                productName: item.productName,
                productSize: item.productSize,
                quantity: new client_1.Prisma.Decimal(item.quantity),
                unitPriceUsd: new client_1.Prisma.Decimal(item.unitPriceUsd),
                lineTotalUsd: new client_1.Prisma.Decimal(lineTotalUsd.toFixed(2)),
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
                exchangeRate: dto.exchangeRate !== undefined ? new client_1.Prisma.Decimal(dto.exchangeRate) : undefined,
                exchangeNote: dto.exchangeNote,
                note: dto.note,
                subtotalUsd: new client_1.Prisma.Decimal(subtotal.toFixed(2)),
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
    async getById(user, deliveryId) {
        await this.ensureCanViewCustomers(user);
        const delivery = await this.prisma.delivery.findFirst({
            where: { id: deliveryId, companyId: user.companyId },
            include: { items: true },
        });
        if (!delivery) {
            throw new common_1.NotFoundException('Teslimat bulunamadi');
        }
        return delivery;
    }
    async remove(user, deliveryId) {
        await this.ensureCanEditDeliveries(user);
        const existing = await this.prisma.delivery.findFirst({
            where: { id: deliveryId, companyId: user.companyId },
        });
        if (!existing) {
            throw new common_1.NotFoundException('Teslimat bulunamadi');
        }
        await this.prisma.delivery.delete({ where: { id: deliveryId } });
        return { message: 'Teslimat silindi' };
    }
    normalize(value) {
        return value
            .toLocaleLowerCase('tr-TR')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, ' ')
            .trim();
    }
    async refreshProductMemories(user, items) {
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
                        lastUsedPriceUsd: new client_1.Prisma.Decimal(item.unitPriceUsd),
                        usageCount: { increment: 1 },
                        lastUsedAt: new Date(),
                    },
                });
            }
            else {
                await this.prisma.productMemory.create({
                    data: {
                        companyId: user.companyId,
                        normalizedKey,
                        displayName: item.productName,
                        sizeLabel: item.productSize,
                        defaultUnit: null,
                        lastUsedPriceUsd: new client_1.Prisma.Decimal(item.unitPriceUsd),
                        usageCount: 1,
                        lastUsedAt: new Date(),
                        createdByUserId: user.sub,
                    },
                });
            }
        }
    }
    async ensureCustomer(companyId, customerId) {
        const customer = await this.prisma.customer.findFirst({
            where: { id: customerId, companyId, isActive: true },
        });
        if (!customer) {
            throw new common_1.NotFoundException('Musteri bulunamadi');
        }
    }
    async ensureCanViewCustomers(user) {
        if (user.role === 'admin')
            return;
        const permission = await this.prisma.employeePermission.findUnique({
            where: { userId: user.sub },
        });
        if (!permission?.canViewCustomers) {
            throw new common_1.UnauthorizedException('Teslimatlari goruntuleme yetkiniz yok');
        }
    }
    async ensureCanCreateDeliveries(user) {
        if (user.role === 'admin')
            return;
        const permission = await this.prisma.employeePermission.findUnique({
            where: { userId: user.sub },
        });
        if (!permission?.canCreateDeliveries) {
            throw new common_1.UnauthorizedException('Teslimat olusturma yetkiniz yok');
        }
    }
    async ensureCanEditDeliveries(user) {
        if (user.role === 'admin')
            return;
        const permission = await this.prisma.employeePermission.findUnique({
            where: { userId: user.sub },
        });
        if (!permission?.canEditDeliveries) {
            throw new common_1.UnauthorizedException('Teslimat duzenleme yetkiniz yok');
        }
    }
};
DeliveriesService = __decorate([
    (0, common_1.Injectable)()
], DeliveriesService);
exports.DeliveriesService = DeliveriesService;
//# sourceMappingURL=deliveries.service.js.map