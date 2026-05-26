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
exports.PortalController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const common_2 = require("@nestjs/common");
const reports_export_service_1 = require("../reports/reports-export.service");
const portal_service_1 = require("./portal.service");
let PortalController = class PortalController {
    constructor(portalService, reportsExportService) {
        this.portalService = portalService;
        this.reportsExportService = reportsExportService;
    }
    dashboard(req) {
        return this.portalService.dashboard(req.user);
    }
    deliveries(req, from, to) {
        return this.portalService.deliveries(req.user, from, to);
    }
    payments(req, from, to) {
        return this.portalService.payments(req.user, from, to);
    }
    monthly(req, year, month) {
        return this.portalService.reportsMonthly(req.user, year, month);
    }
    yearly(req, year) {
        return this.portalService.reportsYearly(req.user, year);
    }
    custom(req, from, to) {
        return this.portalService.reportsCustom(req.user, from, to);
    }
    exportXlsx(req, res, type, from, to, year, month) {
        return this.portalService
            .export(req.user, type || 'custom', from, to, year, month)
            .then((report) => this.reportsExportService.createXlsx(report))
            .then((buffer) => {
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename="portal-rapor.xlsx"');
            return res.send(Buffer.from(buffer));
        });
    }
    exportPrint(req, type, from, to, year, month) {
        return this.portalService.export(req.user, type || 'custom', from, to, year, month);
    }
};
__decorate([
    (0, common_1.Get)('dashboard'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PortalController.prototype, "dashboard", null);
__decorate([
    (0, common_1.Get)('deliveries'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('from')),
    __param(2, (0, common_1.Query)('to')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], PortalController.prototype, "deliveries", null);
__decorate([
    (0, common_1.Get)('payments'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('from')),
    __param(2, (0, common_1.Query)('to')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], PortalController.prototype, "payments", null);
__decorate([
    (0, common_1.Get)('reports/monthly'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('year')),
    __param(2, (0, common_1.Query)('month')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], PortalController.prototype, "monthly", null);
__decorate([
    (0, common_1.Get)('reports/yearly'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PortalController.prototype, "yearly", null);
__decorate([
    (0, common_1.Get)('reports/custom'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('from')),
    __param(2, (0, common_1.Query)('to')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], PortalController.prototype, "custom", null);
__decorate([
    (0, common_1.Get)('reports/export/xlsx'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Query)('type')),
    __param(3, (0, common_1.Query)('from')),
    __param(4, (0, common_1.Query)('to')),
    __param(5, (0, common_1.Query)('year')),
    __param(6, (0, common_1.Query)('month')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], PortalController.prototype, "exportXlsx", null);
__decorate([
    (0, common_1.Get)('reports/export/print'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('type')),
    __param(2, (0, common_1.Query)('from')),
    __param(3, (0, common_1.Query)('to')),
    __param(4, (0, common_1.Query)('year')),
    __param(5, (0, common_1.Query)('month')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], PortalController.prototype, "exportPrint", null);
PortalController = __decorate([
    (0, common_2.Controller)('portal'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [portal_service_1.PortalService,
        reports_export_service_1.ReportsExportService])
], PortalController);
exports.PortalController = PortalController;
//# sourceMappingURL=portal.controller.js.map