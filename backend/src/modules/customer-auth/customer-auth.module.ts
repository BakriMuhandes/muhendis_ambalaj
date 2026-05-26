import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { CustomerAuthController } from './customer-auth.controller';
import { CustomerAuthService } from './customer-auth.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret:
          configService.get<string>('JWT_CUSTOMER_ACCESS_SECRET') ||
          configService.get<string>('JWT_ACCESS_SECRET') ||
          'access-secret',
      }),
    }),
  ],
  controllers: [CustomerAuthController],
  providers: [CustomerAuthService, JwtStrategy],
})
export class CustomerAuthModule {}