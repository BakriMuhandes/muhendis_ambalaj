"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PortalService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const reports_service_1 = require("../reports/reports.service");
let PortalService = class PortalService {
    constructor(reportsService) {
        this.reportsService = reportsService;
        this.prisma = new client_1.PrismaClient();
    }
    async dashboard(user) {
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
        const lastDate = latestDelivery && latestPayment
            ? new Date(Math.max(latestDelivery.transactionDate.getTime(), latestPayment.paymentDate.getTime()))
            : latestDelivery?.transactionDate || latestPayment?.paymentDate || null;
        return {
            guncelBorcUsd: Number((totalDebtUsd - totalPaymentUsd).toFixed(2)),
            toplamTeslimatUsd: totalDebtUsd,
            toplamOdemeUsd: totalPaymentUsd,
            sonIslemTarihi: lastDate ? lastDate.toISOString().slice(0, 10) : null,
        };
    }
    async deliveries(user, from, to) {
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
    async payments(user, from, to) {
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
    reportsMonthly(user, year, month) {
        this.ensureCustomerToken(user);
        const staffLikeUser = { sub: user.sub, companyId: user.companyId, role: 'admin', type: 'staff' };
        return this.reportsService.monthly(staffLikeUser, user.customerId, year, month);
    }
    reportsYearly(user, year) {
        this.ensureCustomerToken(user);
        const staffLikeUser = { sub: user.sub, companyId: user.companyId, role: 'admin', type: 'staff' };
        return this.reportsService.yearly(staffLikeUser, user.customerId, year);
    }
    reportsCustom(user, from, to) {
        this.ensureCustomerToken(user);
        const staffLikeUser = { sub: user.sub, companyId: user.companyId, role: 'admin', type: 'staff' };
        return this.reportsService.custom(staffLikeUser, user.customerId, from, to);
    }
    export(user, type, from, to, year, month) {
        this.ensureCustomerToken(user);
        const staffLikeUser = { sub: user.sub, companyId: user.companyId, role: 'admin', type: 'staff' };
        return this.reportsService.exportPrint(staffLikeUser, user.customerId, type, from, to, year, month);
    }
    ensureCustomerToken(user) {
        if (!user?.customerId || user.type !== 'customer') {
            throw new common_1.UnauthorizedException('Musteri tokeni gerekli');
        }
    }
};
PortalService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [reports_service_1.ReportsService])
], PortalService);
exports.PortalService = PortalService;
//# sourceMappingURL=portal.service.js.map