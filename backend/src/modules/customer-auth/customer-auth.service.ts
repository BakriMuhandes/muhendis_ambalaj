import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';
import { LoginDto } from '../auth/dto/login.dto';

type CustomerPayload = {
  sub: string;
  customerId: string;
  companyId: string;
  username: string;
  type: 'customer';
};

@Injectable()
export class CustomerAuthService {
  private readonly prisma = new PrismaClient();

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(dto: LoginDto) {
    const credential = await this.prisma.customerCredential.findUnique({
      where: { username: dto.username },
      include: { customer: true },
    });

    if (!credential || !credential.isActive || !credential.customer.isActive) {
      throw new UnauthorizedException('Kullanici adi veya sifre hatali');
    }

    const ok = await argon2.verify(credential.passwordHash, dto.password);
    if (!ok) {
      throw new UnauthorizedException('Kullanici adi veya sifre hatali');
    }

    await this.prisma.customerCredential.update({
      where: { id: credential.id },
      data: { lastLoginAt: new Date() },
    });

    const payload: CustomerPayload = {
      sub: credential.id,
      customerId: credential.customerId,
      companyId: credential.customer.companyId,
      username: credential.username,
      type: 'customer',
    };

    return this.issueTokens(payload);
  }

  async me(credentialId: string) {
    const credential = await this.prisma.customerCredential.findUnique({
      where: { id: credentialId },
      include: { customer: true },
    });
    if (!credential) {
      throw new UnauthorizedException('Musteri bulunamadi');
    }
    return {
      id: credential.id,
      username: credential.username,
      mustChangePassword: credential.mustChangePassword,
      customer: {
        id: credential.customer.id,
        fullName: credential.customer.fullName,
        companyId: credential.customer.companyId,
      },
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync<CustomerPayload>(refreshToken, {
        secret:
          this.configService.get<string>('JWT_CUSTOMER_REFRESH_SECRET') ||
          this.configService.get<string>('JWT_REFRESH_SECRET') ||
          'refresh-secret',
      });
      return this.issueTokens(payload);
    } catch {
      throw new UnauthorizedException('Gecersiz yenileme tokeni');
    }
  }

  private async issueTokens(payload: CustomerPayload) {
    const accessSecret =
      this.configService.get<string>('JWT_CUSTOMER_ACCESS_SECRET') ||
      this.configService.get<string>('JWT_ACCESS_SECRET') ||
      'access-secret';
    const refreshSecret =
      this.configService.get<string>('JWT_CUSTOMER_REFRESH_SECRET') ||
      this.configService.get<string>('JWT_REFRESH_SECRET') ||
      'refresh-secret';

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: accessSecret,
        expiresIn:
          this.configService.get<string>('JWT_CUSTOMER_ACCESS_EXPIRES') || '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: refreshSecret,
        expiresIn:
          this.configService.get<string>('JWT_CUSTOMER_REFRESH_EXPIRES') || '30d',
      }),
    ]);

    return { accessToken, refreshToken, tokenType: 'Bearer' };
  }
}