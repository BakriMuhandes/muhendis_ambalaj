import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient, UserRole } from '@prisma/client';
import * as argon2 from 'argon2';
import { LoginDto } from './dto/login.dto';

type UserPayload = {
  sub: string;
  companyId: string;
  role: UserRole;
  username: string;
  type: 'staff';
};

@Injectable()
export class AuthService {
  private readonly prisma = new PrismaClient();

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        username: dto.username,
        isActive: true,
        role: { in: ['admin', 'employee'] },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Kullanici adi veya sifre hatali');
    }

    const ok = await argon2.verify(user.passwordHash, dto.password);
    if (!ok) {
      throw new UnauthorizedException('Kullanici adi veya sifre hatali');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const payload: UserPayload = {
      sub: user.id,
      companyId: user.companyId,
      role: user.role,
      username: user.username,
      type: 'staff',
    };

    return this.issueTokens(payload);
  }

  async refresh(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync<UserPayload>(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET') || 'refresh-secret',
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });
      if (!user || !user.isActive) {
        throw new UnauthorizedException('Gecersiz yenileme tokeni');
      }

      return this.issueTokens({
        sub: user.id,
        companyId: user.companyId,
        role: user.role,
        username: user.username,
        type: 'staff',
      });
    } catch {
      throw new UnauthorizedException('Gecersiz yenileme tokeni');
    }
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        fullName: true,
        username: true,
        role: true,
        companyId: true,
        isActive: true,
      },
    });
    if (!user) {
      throw new UnauthorizedException('Kullanici bulunamadi');
    }
    return user;
  }

  private async issueTokens(payload: UserPayload) {
    const accessSecret =
      this.configService.get<string>('JWT_ACCESS_SECRET') || 'access-secret';
    const refreshSecret =
      this.configService.get<string>('JWT_REFRESH_SECRET') || 'refresh-secret';

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: accessSecret,
        expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRES') || '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: refreshSecret,
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES') || '30d',
      }),
    ]);

    return { accessToken, refreshToken, tokenType: 'Bearer' };
  }
}