import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        tokenType: string;
    }>;
    refresh(refreshToken?: string): Promise<{
        accessToken: string;
        refreshToken: string;
        tokenType: string;
    }>;
    me(req: any): Promise<{
        id: string;
        fullName: string;
        username: string;
        role: import(".prisma/client").UserRole;
        companyId: string;
        isActive: boolean;
    }>;
}
