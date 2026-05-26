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
exports.CustomerAuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const client_1 = require("@prisma/client");
const argon2 = require("argon2");
let CustomerAuthService = class CustomerAuthService {
    constructor(jwtService, configService) {
        this.jwtService = jwtService;
        this.configService = configService;
        this.prisma = new client_1.PrismaClient();
    }
    async login(dto) {
        const credential = await this.prisma.customerCredential.findUnique({
            where: { username: dto.username },
            include: { customer: true },
        });
        if (!credential || !credential.isActive || !credential.customer.isActive) {
            throw new common_1.UnauthorizedException('Kullanici adi veya sifre hatali');
        }
        const ok = await argon2.verify(credential.passwordHash, dto.password);
        if (!ok) {
            throw new common_1.UnauthorizedException('Kullanici adi veya sifre hatali');
        }
        await this.prisma.customerCredential.update({
            where: { id: credential.id },
            data: { lastLoginAt: new Date() },
        });
        const payload = {
            sub: credential.id,
            customerId: credential.customerId,
            companyId: credential.customer.companyId,
            username: credential.username,
            type: 'customer',
        };
        return this.issueTokens(payload);
    }
    async me(credentialId) {
        const credential = await this.prisma.customerCredential.findUnique({
            where: { id: credentialId },
            include: { customer: true },
        });
        if (!credential) {
            throw new common_1.UnauthorizedException('Musteri bulunamadi');
        }
        return {
            id: credential.id,
            username: credential.username,
            mustChangePassword: credential.mustChangePassword,
            customer: {
                id: credential.customer.id,
                fullName: credential.customer.fullName,
                companyId: credential.customer.companyId,
            },
        };
    }
    async refresh(refreshToken) {
        try {
            const payload = await this.jwtService.verifyAsync(refreshToken, {
                secret: this.configService.get('JWT_CUSTOMER_REFRESH_SECRET') ||
                    this.configService.get('JWT_REFRESH_SECRET') ||
                    'refresh-secret',
            });
            return this.issueTokens(payload);
        }
        catch {
            throw new common_1.UnauthorizedException('Gecersiz yenileme tokeni');
        }
    }
    async issueTokens(payload) {
        const accessSecret = this.configService.get('JWT_CUSTOMER_ACCESS_SECRET') ||
            this.configService.get('JWT_ACCESS_SECRET') ||
            'access-secret';
        const refreshSecret = this.configService.get('JWT_CUSTOMER_REFRESH_SECRET') ||
            this.configService.get('JWT_REFRESH_SECRET') ||
            'refresh-secret';
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: accessSecret,
                expiresIn: this.configService.get('JWT_CUSTOMER_ACCESS_EXPIRES') || '15m',
            }),
            this.jwtService.signAsync(payload, {
                secret: refreshSecret,
                expiresIn: this.configService.get('JWT_CUSTOMER_REFRESH_EXPIRES') || '30d',
            }),
        ]);
        return { accessToken, refreshToken, tokenType: 'Bearer' };
    }
};
CustomerAuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        config_1.ConfigService])
], CustomerAuthService);
exports.CustomerAuthService = CustomerAuthService;
//# sourceMappingURL=customer-auth.service.js.map