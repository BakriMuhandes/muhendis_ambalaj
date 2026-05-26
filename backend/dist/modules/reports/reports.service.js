"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
let ReportsService = class ReportsService {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    async customerSummary(user, customerId) {
        await this.ensureCanViewReports(user);
        const customer = await this.ensureCustomer(user.companyId, customerId);
        const totals = await this.buildTotals(user.companyId, customerId);
        return {
            customer: { id: customer.id, fullName: customer.fullName },
            ...totals,
        };
    }
    async customerLedger(user, customerId, from, to) {
        await this.ensureCanViewReports(user);
        const customer = await this.ensureCustomer(user.companyId, customerId);
        const period = this.resolveCustomPeriod(from, to);
        return this.buildReport(user.companyId, customer.id, customer.fullName, period, 'ozel');
    }
    async monthly(user, customerId, year, month) {
        await this.ensureCanViewReports(user);
        const customer = await this.ensureCustomer(user.companyId, customerId);
        const period = this.resolveMonthlyPeriod(year, month);
        return this.buildReport(user.companyId, customer.id, customer.fullName, period, 'aylik');
    }
    async yearly(user, customerId, year) {
        await this.ensureCanViewReports(user);
        const customer = await this.ensureCustomer(user.companyId, customerId);
        const period = this.resolveYearlyPeriod(year);
        return this.buildReport(user.companyId, customer.id, customer.fullName, period, 'yillik');
    }
    async custom(user, customerId, from, to) {
        await this.ensureCanViewReports(user);
        const customer = await this.ensureCustomer(user.companyId, customerId);
        const period = this.resolveCustomPeriod(from, to);
        return this.buildReport(user.companyId, customer.id, customer.fullName, period, 'ozel');
    }
    async exportPrint(user, customerId, type, from, to, year, month) {
        await this.ensureCanViewReports(user);
        const customer = await this.ensureCustomer(user.companyId, customerId);
        const period = this.resolvePeriod(type, from, to, year, month);
        const reportType = type === 'monthly' ? 'aylik' : type === 'yearly' ? 'yillik' : 'ozel';
        return this.buildReport(user.companyId, customer.id, customer.fullName, period, reportType);
    }
    async buildReport(companyId, customerId, customerName, period, reportType) {
        const [deliveries, payments, totals, chart] = await Promise.all([
            this.prisma.delivery.findMany({
                where: {
                    companyId,
                    customerId,
                    transactionDate: { gte: period.fromDate, lte: period.toDate },
                },
                include: { items: true },
                orderBy: { transactionDate: 'asc' },
            }),
            this.prisma.payment.findMany({
                where: {
                    companyId,
                    customerId,
                    paymentDate: { gte: period.fromDate, lte: period.toDate },
                },
                orderBy: { paymentDate: 'asc' },
            }),
            this.buildTotals(companyId, customerId, period),
            this.buildChartData(companyId, customerId, period),
        ]);
        const ledger = this.buildLedger(deliveries, payments);
        return {
            reportType,
            customer: { id: customerId, fullName: customerName },
            period: {
                from: period.fromDate.toISOString().slice(0, 10),
                to: period.toDate.toISOString().slice(0, 10),
            },
            deliveries,
            payments,
            ledger,
            totals,
            charts: chart,
            generatedAt: new Date().toISOString(),
        };
    }
    buildLedger(deliveries, payments) {
        const rows = [];
        for (const delivery of deliveries) {
            rows.push({
                date: delivery.transactionDate.toISOString().slice(0, 10),
                type: 'teslimat',
                description: `Teslimat #${delivery.id.slice(0, 8)}`,
                debtUsd: Number(delivery.subtotalUsd),
                paymentUsd: 0,
                balanceUsd: 0,
            });
        }
        for (const payment of payments) {
            rows.push({
                date: payment.paymentDate.toISOString().slice(0, 10),
                type: 'odeme',
                description: `Odeme #${payment.id.slice(0, 8)}`,
                debtUsd: 0,
                paymentUsd: Number(payment.amountUsd),
                balanceUsd: 0,
            });
        }
        rows.sort((a, b) => a.date.localeCompare(b.date));
        let running = 0;
        for (const row of rows) {
            running += row.debtUsd - row.paymentUsd;
            row.balanceUsd = Number(running.toFixed(2));
        }
        return rows;
    }
    async buildChartData(companyId, customerId, period) {
        const [deliveries, payments] = await Promise.all([
            this.prisma.delivery.findMany({
                where: {
                    companyId,
                    customerId,
                    transactionDate: { gte: period.fromDate, lte: period.toDate },
                },
                select: { transactionDate: true, subtotalUsd: true },
            }),
            this.prisma.payment.findMany({
                where: {
                    companyId,
                    customerId,
                    paymentDate: { gte: period.fromDate, lte: period.toDate },
                },
                select: { paymentDate: true, amountUsd: true },
            }),
        ]);
        const bucket = new Map();
        const add = (label, key, amount) => {
            if (!bucket.has(label)) {
                bucket.set(label, { label, teslimat: 0, odeme: 0 });
            }
            bucket.get(label)[key] += amount;
        };
        for (const d of deliveries) {
            const label = d.transactionDate.toISOString().slice(0, 7);
            add(label, 'teslimat', Number(d.subtotalUsd));
        }
        for (const p of payments) {
            const label = p.paymentDate.toISOString().slice(0, 7);
            add(label, 'odeme', Number(p.amountUsd));
        }
        const monthly = Array.from(bucket.values())
            .sort((a, b) => a.label.localeCompare(b.label))
            .map((item) => ({
            ...item,
            bakiyeDegisim: Number((item.teslimat - item.odeme).toFixed(2)),
        }));
        return { monthly };
    }
    async buildTotals(companyId, customerId, period) {
        const deliveryWhere = { companyId, customerId };
        const paymentWhere = { companyId, customerId };
        if (period) {
            deliveryWhere.transactionDate = { gte: period.fromDate, lte: period.toDate };
            paymentWhere.paymentDate = { gte: period.fromDate, lte: period.toDate };
        }
        const [deliveryAgg, paymentAgg] = await Promise.all([
            this.prisma.delivery.aggregate({
                where: deliveryWhere,
                _sum: { subtotalUsd: true },
            }),
            this.prisma.payment.aggregate({
                where: paymentWhere,
                _sum: { amountUsd: true },
            }),
        ]);
        const totalDebtUsd = Number(deliveryAgg._sum.subtotalUsd || 0);
        const totalPaymentUsd = Number(paymentAgg._sum.amountUsd || 0);
        return {
            totalDebtUsd,
            totalPaymentUsd,
            balanceUsd: Number((totalDebtUsd - totalPaymentUsd).toFixed(2)),
        };
    }
    resolveMonthlyPeriod(year, month) {
        const y = Number(year);
        const m = Number(month);
        if (!Number.isInteger(y) || !Number.isInteger(m) || m < 1 || m > 12) {
            throw new common_1.NotFoundException('Aylik rapor parametreleri gecersiz');
        }
        const fromDate = new Date(Date.UTC(y, m - 1, 1));
        const toDate = new Date(Date.UTC(y, m, 0));
        return { fromDate, toDate };
    }
    resolveYearlyPeriod(year) {
        const y = Number(year);
        if (!Number.isInteger(y)) {
            throw new common_1.NotFoundException('Yil parametresi gecersiz');
        }
        return {
            fromDate: new Date(Date.UTC(y, 0, 1)),
            toDate: new Date(Date.UTC(y, 11, 31)),
        };
    }
    resolveCustomPeriod(from, to) {
        const fromDate = from ? new Date(from) : new Date(Date.UTC(new Date().getUTCFullYear(), 0, 1));
        const toDate = to ? new Date(to) : new Date();
        if (Number.isNaN(fromDate.getTime()) || Number.isNaN(toDate.getTime()) || fromDate > toDate) {
            throw new common_1.NotFoundException('Tarih araligi gecersiz');
        }
        return { fromDate, toDate };
    }
    resolvePeriod(type, from, to, year, month) {
        if (type === 'monthly')
            return this.resolveMonthlyPeriod(year || '', month || '');
        if (type === 'yearly')
            return this.resolveYearlyPeriod(year || '');
        return this.resolveCustomPeriod(from, to);
    }
    async ensureCustomer(companyId, customerId) {
        const customer = await this.prisma.customer.findFirst({
            where: { id: customerId, companyId, isActive: true },
        });
        if (!customer) {
            throw new common_1.NotFoundException('Musteri bulunamadi');
        }
        return customer;
    }
    async ensureCanViewReports(user) {
        if (user.role === 'admin')
            return;
        const permission = await this.prisma.employeePermission.findUnique({
            where: { userId: user.sub },
        });
        if (!permission?.canViewReports) {
            throw new common_1.UnauthorizedException('Rapor goruntuleme yetkiniz yok');
        }
    }
};
ReportsService = __decorate([
    (0, common_1.Injectable)()
], ReportsService);
exports.ReportsService = ReportsService;
//# sourceMappingURL=reports.service.js.map