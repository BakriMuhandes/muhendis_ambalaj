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
exports.CustomerAuthController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const login_dto_1 = require("../auth/dto/login.dto");
const customer_auth_service_1 = require("./customer-auth.service");
let CustomerAuthController = class CustomerAuthController {
    constructor(customerAuthService) {
        this.customerAuthService = customerAuthService;
    }
    login(dto) {
        return this.customerAuthService.login(dto);
    }
    refresh(refreshToken) {
        if (!refreshToken) {
            throw new common_1.UnauthorizedException('Refresh token zorunludur');
        }
        return this.customerAuthService.refresh(refreshToken);
    }
    me(req) {
        return this.customerAuthService.me(req.user.sub);
    }
};
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", void 0)
], CustomerAuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('refresh'),
    __param(0, (0, common_1.Body)('refreshToken')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CustomerAuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CustomerAuthController.prototype, "me", null);
CustomerAuthController = __decorate([
    (0, common_1.Controller)('customer-auth'),
    __metadata("design:paramtypes", [customer_auth_service_1.CustomerAuthService])
], CustomerAuthController);
exports.CustomerAuthController = CustomerAuthController;
//# sourceMappingURL=customer-auth.controller.js.map