"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeesService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const argon2 = require("argon2");
const crypto_1 = require("crypto");
let EmployeesService = class EmployeesService {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    async list(user) {
        await this.ensureCanManageEmployees(user);
        return this.prisma.user.findMany({
            where: { companyId: user.companyId, role: 'employee' },
            orderBy: { createdAt: 'desc' },
            include: { employeePermission: true },
        });
    }
    async create(user, dto) {
        await this.ensureCanManageEmployees(user);
        const existing = await this.prisma.user.findFirst({
            where: { companyId: user.companyId, username: dto.username },
        });
        if (existing) {
            throw new common_1.ConflictException('Bu kullanici adi zaten kullaniliyor');
        }
        const plainPassword = dto.password || (0, crypto_1.randomBytes)(6).toString('base64url');
        const passwordHash = await argon2.hash(plainPassword);
        const employee = await this.prisma.user.create({
            data: {
                companyId: user.companyId,
                fullName: dto.fullName,
                username: dto.username,
                passwordHash,
                role: 'employee',
                isActive: true,
            },
        });
        const permission = await this.prisma.employeePermission.create({
            data: {
                userId: employee.id,
                canViewCustomers: true,
                canCreateCustomers: false,
                canCreateDeliveries: true,
                canEditDeliveries: false,
                canCreatePayments: true,
                canViewReports: true,
                canExportReports: false,
                canManageEmployees: false,
                canManageSettings: false,
            },
        });
        return {
            employee: {
                id: employee.id,
                companyId: employee.companyId,
                fullName: employee.fullName,
                username: employee.username,
                role: employee.role,
                isActive: employee.isActive,
            },
            permission,
            credentials: { username: employee.username, password: plainPassword },
        };
    }
    async updatePermissions(user, employeeId, dto) {
        await this.ensureCanManageEmployees(user);
        const employee = await this.prisma.user.findFirst({
            where: { id: employeeId, companyId: user.companyId, role: 'employee' },
        });
        if (!employee) {
            throw new common_1.NotFoundException('Calisan bulunamadi');
        }
        return this.prisma.employeePermission.upsert({
            where: { userId: employee.id },
            create: { userId: employee.id, ...dto },
            update: dto,
        });
    }
    async ensureCanManageEmployees(user) {
        if (user.role === 'admin') {
            return;
        }
        const permission = await this.prisma.employeePermission.findUnique({
            where: { userId: user.sub },
        });
        if (!permission?.canManageEmployees) {
            throw new common_1.UnauthorizedException('Calisan yonetimi yetkiniz yok');
        }
    }
};
EmployeesService = __decorate([
    (0, common_1.Injectable)()
], EmployeesService);
exports.EmployeesService = EmployeesService;
//# sourceMappingURL=employees.service.js.map