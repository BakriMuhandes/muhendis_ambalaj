"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductMemoriesService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
let ProductMemoriesService = class ProductMemoriesService {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    async suggest(user, query, limit = 10) {
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
    normalize(value) {
        return value
            .toLocaleLowerCase('tr-TR')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, ' ')
            .trim();
    }
    async ensureCanCreateDeliveries(user) {
        if (user.role === 'admin')
            return;
        const permission = await this.prisma.employeePermission.findUnique({
            where: { userId: user.sub },
        });
        if (!permission?.canCreateDeliveries) {
            throw new common_1.UnauthorizedException('Urun onerisi icin teslimat yetkisi gerekir');
        }
    }
};
ProductMemoriesService = __decorate([
    (0, common_1.Injectable)()
], ProductMemoriesService);
exports.ProductMemoriesService = ProductMemoriesService;
//# sourceMappingURL=product-memories.service.js.map