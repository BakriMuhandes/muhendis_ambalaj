"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
let PaymentsService = class PaymentsService {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    async list(user) {
        await this.ensureCanViewCustomers(user);
        return this.prisma.payment.findMany({
            where: { companyId: user.companyId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async create(user, dto) {
        await this.ensureCanCreatePayments(user);
        await this.ensureCustomer(user.companyId, dto.customerId);
        const paymentDate = dto.paymentDate ? new Date(dto.paymentDate) : new Date();
        const payment = await this.prisma.payment.create({
            data: {
                companyId: user.companyId,
                customerId: dto.customerId,
                enteredByUserId: user.sub,
                paymentDate,
                amountUsd: new client_1.Prisma.Decimal(dto.amountUsd),
                exchangeCurrency: dto.exchangeCurrency,
                exchangeRate: dto.exchangeRate !== undefined ? new client_1.Prisma.Decimal(dto.exchangeRate) : undefined,
                amountExchange: dto.amountExchange !== undefined ? new client_1.Prisma.Decimal(dto.amountExchange) : undefined,
                exchangeNote: dto.exchangeNote,
                paymentMethod: dto.paymentMethod,
                referenceNo: dto.referenceNo,
                note: dto.note,
            },
        });
        const balance = await this.calculateBalance(user.companyId, dto.customerId);
        return { payment, balance };
    }
    async getById(user, paymentId) {
        await this.ensureCanViewCustomers(user);
        const payment = await this.prisma.payment.findFirst({
            where: { id: paymentId, companyId: user.companyId },
        });
        if (!payment) {
            throw new common_1.NotFoundException('Odeme bulunamadi');
        }
        return payment;
    }
    async remove(user, paymentId) {
        await this.ensureCanCreatePayments(user);
        const existing = await this.prisma.payment.findFirst({
            where: { id: paymentId, companyId: user.companyId },
        });
        if (!existing) {
            throw new common_1.NotFoundException('Odeme bulunamadi');
        }
        await this.prisma.payment.delete({ where: { id: paymentId } });
        return { message: 'Odeme silindi' };
    }
    async calculateBalance(companyId, customerId) {
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
            throw new common_1.UnauthorizedException('Odeme goruntuleme yetkiniz yok');
        }
    }
    async ensureCanCreatePayments(user) {
        if (user.role === 'admin')
            return;
        const permission = await this.prisma.employeePermission.findUnique({
            where: { userId: user.sub },
        });
        if (!permission?.canCreatePayments) {
            throw new common_1.UnauthorizedException('Odeme olusturma yetkiniz yok');
        }
    }
};
PaymentsService = __decorate([
    (0, common_1.Injectable)()
], PaymentsService);
exports.PaymentsService = PaymentsService;
//# sourceMappingURL=payments.service.js.map