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
exports.DeliveriesController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const roles_guard_1 = require("../../common/guards/roles.guard");
const create_delivery_dto_1 = require("./dto/create-delivery.dto");
const deliveries_service_1 = require("./deliveries.service");
let DeliveriesController = class DeliveriesController {
    constructor(deliveriesService) {
        this.deliveriesService = deliveriesService;
    }
    list(req) {
        return this.deliveriesService.list(req.user);
    }
    create(req, dto) {
        return this.deliveriesService.create(req.user, dto);
    }
    getById(req, deliveryId) {
        return this.deliveriesService.getById(req.user, deliveryId);
    }
    remove(req, deliveryId) {
        return this.deliveriesService.remove(req.user, deliveryId);
    }
};
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DeliveriesController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('admin', 'employee'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_delivery_dto_1.CreateDeliveryDto]),
    __metadata("design:returntype", void 0)
], DeliveriesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':deliveryId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('deliveryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], DeliveriesController.prototype, "getById", null);
__decorate([
    (0, common_1.Delete)(':deliveryId'),
    (0, roles_decorator_1.Roles)('admin', 'employee'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('deliveryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], DeliveriesController.prototype, "remove", null);
DeliveriesController = __decorate([
    (0, common_1.Controller)('deliveries'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [deliveries_service_1.DeliveriesService])
], DeliveriesController);
exports.DeliveriesController = DeliveriesController;
//# sourceMappingURL=deliveries.controller.js.map