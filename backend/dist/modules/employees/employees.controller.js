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
exports.EmployeesController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const roles_guard_1 = require("../../common/guards/roles.guard");
const create_employee_dto_1 = require("./dto/create-employee.dto");
const update_permissions_dto_1 = require("./dto/update-permissions.dto");
const employees_service_1 = require("./employees.service");
let EmployeesController = class EmployeesController {
    constructor(employeesService) {
        this.employeesService = employeesService;
    }
    list(req) {
        return this.employeesService.list(req.user);
    }
    create(req, dto) {
        return this.employeesService.create(req.user, dto);
    }
    updatePermissions(req, employeeId, dto) {
        return this.employeesService.updatePermissions(req.user, employeeId, dto);
    }
};
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('admin', 'employee'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EmployeesController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('admin', 'employee'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_employee_dto_1.CreateEmployeeDto]),
    __metadata("design:returntype", void 0)
], EmployeesController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':employeeId/permissions'),
    (0, roles_decorator_1.Roles)('admin', 'employee'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('employeeId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_permissions_dto_1.UpdatePermissionsDto]),
    __metadata("design:returntype", void 0)
], EmployeesController.prototype, "updatePermissions", null);
EmployeesController = __decorate([
    (0, common_1.Controller)('employees'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [employees_service_1.EmployeesService])
], EmployeesController);
exports.EmployeesController = EmployeesController;
//# sourceMappingURL=employees.controller.js.map