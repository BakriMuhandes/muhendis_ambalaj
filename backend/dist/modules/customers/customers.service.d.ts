import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
type StaffUser = {
    sub: string;
    companyId: string;
    role: 'admin' | 'employee';
    username: string;
    type: 'staff';
};
export declare class CustomersService {
    private readonly prisma;
    list(user: StaffUser): Promise<{
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
    create(user: StaffUser, dto: CreateCustomerDto): Promise<{
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
    getById(user: StaffUser, customerId: string): Promise<import("@prisma/client/runtime").GetResult<{
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
    update(user: StaffUser, customerId: string, dto: UpdateCustomerDto): Promise<import("@prisma/client/runtime").GetResult<{
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
    resetCredentials(user: StaffUser, customerId: string): Promise<{
        username: string;
        password: string;
    }>;
    accountSummary(user: StaffUser, customerId: string): Promise<{
        customerId: string;
        totalDebtUsd: number;
        totalPaymentUsd: number;
        balanceUsd: number;
    }>;
    private findCustomerOrThrow;
    private normalizeForUsername;
    private generatePassword;
    private generateUniqueUsername;
    private generateCredentialsForCustomer;
    private ensureCanViewCustomers;
    private ensureCanCreateCustomers;
}
export {};
