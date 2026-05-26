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
exports.CustomersController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const roles_guard_1 = require("../../common/guards/roles.guard");
const create_customer_dto_1 = require("./dto/create-customer.dto");
const update_customer_dto_1 = require("./dto/update-customer.dto");
const customers_service_1 = require("./customers.service");
let CustomersController = class CustomersController {
    constructor(customersService) {
        this.customersService = customersService;
    }
    list(req) {
        return this.customersService.list(req.user);
    }
    create(req, dto) {
        return this.customersService.create(req.user, dto);
    }
    getById(req, customerId) {
        return this.customersService.getById(req.user, customerId);
    }
    update(req, customerId, dto) {
        return this.customersService.update(req.user, customerId, dto);
    }
    resetCredentials(req, customerId) {
        return this.customersService.resetCredentials(req.user, customerId);
    }
    getAccountSummary(req, customerId) {
        return this.customersService.accountSummary(req.user, customerId);
    }
};
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CustomersController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('admin', 'employee'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_customer_dto_1.CreateCustomerDto]),
    __metadata("design:returntype", void 0)
], CustomersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':customerId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('customerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CustomersController.prototype, "getById", null);
__decorate([
    (0, common_1.Patch)(':customerId'),
    (0, roles_decorator_1.Roles)('admin', 'employee'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('customerId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_customer_dto_1.UpdateCustomerDto]),
    __metadata("design:returntype", void 0)
], CustomersController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':customerId/reset-credentials'),
    (0, roles_decorator_1.Roles)('admin', 'employee'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('customerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CustomersController.prototype, "resetCredentials", null);
__decorate([
    (0, common_1.Get)(':customerId/account-summary'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('customerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CustomersController.prototype, "getAccountSummary", null);
CustomersController = __decorate([
    (0, common_1.Controller)('customers'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [customers_service_1.CustomersService])
], CustomersController);
exports.CustomersController = CustomersController;
//# sourceMappingURL=customers.controller.js.map