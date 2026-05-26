"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const auth_module_1 = require("./modules/auth/auth.module");
const customer_auth_module_1 = require("./modules/customer-auth/customer-auth.module");
const customers_module_1 = require("./modules/customers/customers.module");
const deliveries_module_1 = require("./modules/deliveries/deliveries.module");
const employees_module_1 = require("./modules/employees/employees.module");
const payments_module_1 = require("./modules/payments/payments.module");
const product_memories_module_1 = require("./modules/product-memories/product-memories.module");
const reports_module_1 = require("./modules/reports/reports.module");
const portal_module_1 = require("./modules/portal/portal.module");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            auth_module_1.AuthModule,
            customer_auth_module_1.CustomerAuthModule,
            customers_module_1.CustomersModule,
            employees_module_1.EmployeesModule,
            deliveries_module_1.DeliveriesModule,
            payments_module_1.PaymentsModule,
            product_memories_module_1.ProductMemoriesModule,
            reports_module_1.ReportsModule,
            portal_module_1.PortalModule,
        ],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map