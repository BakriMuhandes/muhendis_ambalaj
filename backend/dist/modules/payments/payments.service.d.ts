import { Prisma } from '@prisma/client';
import { CreatePaymentDto } from './dto/create-payment.dto';
type StaffUser = {
    sub: string;
    companyId: string;
    role: 'admin' | 'employee';
    type: 'staff';
};
export declare class PaymentsService {
    private readonly prisma;
    list(user: StaffUser): Promise<(import("@prisma/client/runtime").GetResult<{
        id: string;
        companyId: string;
        customerId: string;
        enteredByUserId: string;
        paymentDate: Date;
        amountUsd: Prisma.Decimal;
        exchangeCurrency: string | null;
        exchangeRate: Prisma.Decimal | null;
        amountExchange: Prisma.Decimal | null;
        exchangeNote: string | null;
        paymentMethod: string;
        referenceNo: string | null;
        note: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, unknown, never> & {})[]>;
    create(user: StaffUser, dto: CreatePaymentDto): Promise<{
        payment: import("@prisma/client/runtime").GetResult<{
            id: string;
            companyId: string;
            customerId: string;
            enteredByUserId: string;
            paymentDate: Date;
            amountUsd: Prisma.Decimal;
            exchangeCurrency: string | null;
            exchangeRate: Prisma.Decimal | null;
            amountExchange: Prisma.Decimal | null;
            exchangeNote: string | null;
            paymentMethod: string;
            referenceNo: string | null;
            note: string | null;
            createdAt: Date;
            updatedAt: Date;
        }, unknown, never> & {};
        balance: {
            customerId: string;
            totalDebtUsd: number;
            totalPaymentUsd: number;
            balanceUsd: number;
        };
    }>;
    getById(user: StaffUser, paymentId: string): Promise<import("@prisma/client/runtime").GetResult<{
        id: string;
        companyId: string;
        customerId: string;
        enteredByUserId: string;
        paymentDate: Date;
        amountUsd: Prisma.Decimal;
        exchangeCurrency: string | null;
        exchangeRate: Prisma.Decimal | null;
        amountExchange: Prisma.Decimal | null;
        exchangeNote: string | null;
        paymentMethod: string;
        referenceNo: string | null;
        note: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, unknown, never> & {}>;
    remove(user: StaffUser, paymentId: string): Promise<{
        message: string;
    }>;
    calculateBalance(companyId: string, customerId: string): Promise<{
        customerId: string;
        totalDebtUsd: number;
        totalPaymentUsd: number;
        balanceUsd: number;
    }>;
    private ensureCustomer;
    private ensureCanViewCustomers;
    private ensureCanCreatePayments;
}
export {};
