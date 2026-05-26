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
exports.ReportsController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("../../common/guards/roles.guard");
const reports_export_service_1 = require("./reports-export.service");
const reports_service_1 = require("./reports.service");
let ReportsController = class ReportsController {
    constructor(reportsService, reportsExportService) {
        this.reportsService = reportsService;
        this.reportsExportService = reportsExportService;
    }
    customerSummary(req, customerId) {
        return this.reportsService.customerSummary(req.user, customerId);
    }
    customerLedger(req, customerId, from, to) {
        return this.reportsService.customerLedger(req.user, customerId, from, to);
    }
    monthly(req, customerId, year, month) {
        return this.reportsService.monthly(req.user, customerId, year, month);
    }
    yearly(req, customerId, year) {
        return this.reportsService.yearly(req.user, customerId, year);
    }
    custom(req, customerId, from, to) {
        return this.reportsService.custom(req.user, customerId, from, to);
    }
    async exportXlsx(req, res, customerId, type, from, to, year, month) {
        const report = await this.reportsService.exportPrint(req.user, customerId, type || 'custom', from, to, year, month);
        const buffer = await this.reportsExportService.createXlsx(report);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=\"rapor.xlsx\"');
        return res.send(Buffer.from(buffer));
    }
    exportPrint(req, customerId, type, from, to, year, month) {
        return this.reportsService.exportPrint(req.user, customerId, type || 'custom', from, to, year, month);
    }
};
__decorate([
    (0, common_1.Get)('customer-summary'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('customerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "customerSummary", null);
__decorate([
    (0, common_1.Get)('customer-ledger'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('customerId')),
    __param(2, (0, common_1.Query)('from')),
    __param(3, (0, common_1.Query)('to')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "customerLedger", null);
__decorate([
    (0, common_1.Get)('monthly'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('customerId')),
    __param(2, (0, common_1.Query)('year')),
    __param(3, (0, common_1.Query)('month')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "monthly", null);
__decorate([
    (0, common_1.Get)('yearly'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('customerId')),
    __param(2, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "yearly", null);
__decorate([
    (0, common_1.Get)('custom'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('customerId')),
    __param(2, (0, common_1.Query)('from')),
    __param(3, (0, common_1.Query)('to')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "custom", null);
__decorate([
    (0, common_1.Get)('export/xlsx'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Query)('customerId')),
    __param(3, (0, common_1.Query)('type')),
    __param(4, (0, common_1.Query)('from')),
    __param(5, (0, common_1.Query)('to')),
    __param(6, (0, common_1.Query)('year')),
    __param(7, (0, common_1.Query)('month')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "exportXlsx", null);
__decorate([
    (0, common_1.Get)('export/print'),
    (0, common_1.Header)('Content-Type', 'application/json; charset=utf-8'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('customerId')),
    __param(2, (0, common_1.Query)('type')),
    __param(3, (0, common_1.Query)('from')),
    __param(4, (0, common_1.Query)('to')),
    __param(5, (0, common_1.Query)('year')),
    __param(6, (0, common_1.Query)('month')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "exportPrint", null);
ReportsController = __decorate([
    (0, common_1.Controller)('reports'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [reports_service_1.ReportsService,
        reports_export_service_1.ReportsExportService])
], ReportsController);
exports.ReportsController = ReportsController;
//# sourceMappingURL=reports.controller.js.map