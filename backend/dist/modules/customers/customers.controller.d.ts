import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomersService } from './customers.service';
export declare class CustomersController {
    private readonly customersService;
    constructor(customersService: CustomersService);
    list(req: any): Promise<{
        id: string;
        customerCode: string | null;
        fullName: string;
        phone: string | null;
        email: string | null;
        address: string | null;
        notes: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    create(req: any, dto: CreateCustomerDto): Promise<{
        customer: import("@prisma/client/runtime").GetResult<{
            id: string;
            companyId: string;
            customerCode: string | null;
            fullName: string;
            phone: string | null;
            email: string | null;
            address: string | null;
            notes: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        }, unknown, never> & {};
        credentials: {
            username: string;
            password: string;
        };
    }>;
    getById(req: any, customerId: string): Promise<import("@prisma/client/runtime").GetResult<{
        id: string;
        companyId: string;
        customerCode: string | null;
        fullName: string;
        phone: string | null;
        email: string | null;
        address: string | null;
        notes: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, unknown, never> & {}>;
    update(req: any, customerId: string, dto: UpdateCustomerDto): Promise<import("@prisma/client/runtime").GetResult<{
        id: string;
        companyId: string;
        customerCode: string | null;
        fullName: string;
        phone: string | null;
        email: string | null;
        address: string | null;
        notes: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, unknown, never> & {}>;
    resetCredentials(req: any, customerId: string): Promise<{
        username: string;
        password: string;
    }>;
    getAccountSummary(req: any, customerId: string): Promise<{
        customerId: string;
        totalDebtUsd: number;
        totalPaymentUsd: number;
        balanceUsd: number;
    }>;
}
