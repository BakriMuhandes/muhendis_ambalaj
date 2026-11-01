import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { CustomerAuthModule } from './modules/customer-auth/customer-auth.module';
import { CustomersModule } from './modules/customers/customers.module';
import { DeliveriesModule } from './modules/deliveries/deliveries.module';
import { EmployeesModule } from './modules/employees/employees.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { ProductMemoriesModule } from './modules/product-memories/product-memories.module';
import { ReportsModule } from './modules/reports/reports.module';
import { PortalModule } from './modules/portal/portal.module';
import { AppController } from './app.controller';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    CustomerAuthModule,
    CustomersModule,
    EmployeesModule,
    DeliveriesModule,
    PaymentsModule,
    ProductMemoriesModule,
    ReportsModule,
    PortalModule,
  ],
})
export class AppModule {}