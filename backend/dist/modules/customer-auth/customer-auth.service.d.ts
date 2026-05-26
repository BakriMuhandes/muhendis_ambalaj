import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../auth/dto/login.dto';
export declare class CustomerAuthService {
    private readonly jwtService;
    private readonly configService;
    private readonly prisma;
    constructor(jwtService: JwtService, configService: ConfigService);
    login(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        tokenType: string;
    }>;
    me(credentialId: string): Promise<{
        id: string;
        username: string;
        mustChangePassword: boolean;
        customer: {
            id: string;
            fullName: string;
            companyId: string;
        };
    }>;
    refresh(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
        tokenType: string;
    }>;
    private issueTokens;
}
