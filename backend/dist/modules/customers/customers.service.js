"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomersService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const argon2 = require("argon2");
const crypto_1 = require("crypto");
let CustomersService = class CustomersService {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    async list(user) {
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
    async create(user, dto) {
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
        const credentials = await this.generateCredentialsForCustomer(user.companyId, customer.id, customer.fullName);
        return { customer, credentials };
    }
    async getById(user, customerId) {
        await this.ensureCanViewCustomers(user);
        return this.findCustomerOrThrow(user.companyId, customerId);
    }
    async update(user, customerId, dto) {
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
    async resetCredentials(user, customerId) {
        await this.ensureCanCreateCustomers(user);
        const customer = await this.findCustomerOrThrow(user.companyId, customerId);
        return this.generateCredentialsForCustomer(user.companyId, customer.id, customer.fullName);
    }
    async accountSummary(user, customerId) {
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
    async findCustomerOrThrow(companyId, customerId) {
        const customer = await this.prisma.customer.findFirst({
            where: { id: customerId, companyId },
        });
        if (!customer) {
            throw new common_1.NotFoundException('Musteri bulunamadi');
        }
        return customer;
    }
    normalizeForUsername(text) {
        return text
            .toLocaleLowerCase('tr-TR')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '')
            .slice(0, 12);
    }
    generatePassword() {
        return (0, crypto_1.randomBytes)(6).toString('base64url');
    }
    async generateUniqueUsername(companyId, fullName) {
        const base = this.normalizeForUsername(fullName) || 'musteri';
        for (let i = 0; i < 1000; i += 1) {
            const suffix = (0, crypto_1.randomBytes)(2).toString('hex');
            const username = `${base}${suffix}`;
            const exists = await this.prisma.customerCredential.findUnique({
                where: { username },
            });
            if (!exists) {
                return username;
            }
        }
        throw new common_1.ForbiddenException(`Kullanici adi olusturulamadi (${companyId})`);
    }
    async generateCredentialsForCustomer(companyId, customerId, fullName) {
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
        }
        else {
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
    async ensureCanViewCustomers(user) {
        if (user.role === 'admin') {
            return;
        }
        const permission = await this.prisma.employeePermission.findUnique({
            where: { userId: user.sub },
        });
        if (!permission?.canViewCustomers) {
            throw new common_1.UnauthorizedException('Musteri goruntuleme yetkiniz yok');
        }
    }
    async ensureCanCreateCustomers(user) {
        if (user.role === 'admin') {
            return;
        }
        const permission = await this.prisma.employeePermission.findUnique({
            where: { userId: user.sub },
        });
        if (!permission?.canCreateCustomers) {
            throw new common_1.UnauthorizedException('Musteri olusturma yetkiniz yok');
        }
    }
};
CustomersService = __decorate([
    (0, common_1.Injectable)()
], CustomersService);
exports.CustomersService = CustomersService;
//# sourceMappingURL=customers.service.js.map