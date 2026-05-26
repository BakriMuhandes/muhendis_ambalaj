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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductMemoriesController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("../../common/guards/roles.guard");
const product_memories_service_1 = require("./product-memories.service");
let ProductMemoriesController = class ProductMemoriesController {
    constructor(productMemoriesService) {
        this.productMemoriesService = productMemoriesService;
    }
    suggest(req, q = '', limit = '10') {
        const parsedLimit = Number(limit) || 10;
        return this.productMemoriesService.suggest(req.user, q, parsedLimit);
    }
};
__decorate([
    (0, common_1.Get)('suggest'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('q')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", void 0)
], ProductMemoriesController.prototype, "suggest", null);
ProductMemoriesController = __decorate([
    (0, common_1.Controller)('product-memories'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [product_memories_service_1.ProductMemoriesService])
], ProductMemoriesController);
exports.ProductMemoriesController = ProductMemoriesController;
//# sourceMappingURL=product-memories.controller.js.map