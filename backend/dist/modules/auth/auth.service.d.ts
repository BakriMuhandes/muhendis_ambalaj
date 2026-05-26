import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '@prisma/client';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private readonly jwtService;
    private readonly configService;
    private readonly prisma;
    constructor(jwtService: JwtService, configService: ConfigService);
    login(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        tokenType: string;
    }>;
    refresh(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
        tokenType: string;
    }>;
    me(userId: string): Promise<{
        id: string;
        fullName: string;
        username: string;
        role: UserRole;
        companyId: string;
        isActive: boolean;
    }>;
    private issueTokens;
}
