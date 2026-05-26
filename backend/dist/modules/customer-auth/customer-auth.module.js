"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerAuthModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const jwt_strategy_1 = require("../auth/strategies/jwt.strategy");
const customer_auth_controller_1 = require("./customer-auth.controller");
const customer_auth_service_1 = require("./customer-auth.service");
let CustomerAuthModule = class CustomerAuthModule {
};
CustomerAuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.registerAsync({
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    secret: configService.get('JWT_CUSTOMER_ACCESS_SECRET') ||
                        configService.get('JWT_ACCESS_SECRET') ||
                        'access-secret',
                }),
            }),
        ],
        controllers: [customer_auth_controller_1.CustomerAuthController],
        providers: [customer_auth_service_1.CustomerAuthService, jwt_strategy_1.JwtStrategy],
    })
], CustomerAuthModule);
exports.CustomerAuthModule = CustomerAuthModule;
//# sourceMappingURL=customer-auth.module.js.map