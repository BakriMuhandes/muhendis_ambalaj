import { LoginDto } from '../auth/dto/login.dto';
import { CustomerAuthService } from './customer-auth.service';
export declare class CustomerAuthController {
    private readonly customerAuthService;
    constructor(customerAuthService: CustomerAuthService);
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
        username: string;
        mustChangePassword: boolean;
        customer: {
            id: string;
            fullName: string;
            companyId: string;
        };
    }>;
}
