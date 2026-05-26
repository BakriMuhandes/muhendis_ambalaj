import { Prisma } from '@prisma/client';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
type StaffUser = {
    sub: string;
    companyId: string;
    role: 'admin' | 'employee';
    type: 'staff';
};
export declare class DeliveriesService {
    private readonly prisma;
    list(user: StaffUser): Promise<({
        items: (import("@prisma/client/runtime").GetResult<{
            id: string;
            deliveryId: string;
            customerId: string;
            productName: string;
            productSize: string | null;
            quantity: Prisma.Decimal;
            unitPriceUsd: Prisma.Decimal;
            lineTotalUsd: Prisma.Decimal;
            createdAt: Date;
            updatedAt: Date;
        }, unknown, never> & {})[];
    } & import("@prisma/client/runtime").GetResult<{
        id: string;
        companyId: string;
        customerId: string;
        createdByUserId: string;
        transactionDate: Date;
        currencyBase: string;
        exchangeCurrency: string | null;
        exchangeRate: Prisma.Decimal | null;
        exchangeNote: string | null;
        subtotalUsd: Prisma.Decimal;
        note: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, unknown, never> & {})[]>;
    create(user: StaffUser, dto: CreateDeliveryDto): Promise<{
        items: (import("@prisma/client/runtime").GetResult<{
            id: string;
            deliveryId: string;
            customerId: string;
            productName: string;
            productSize: string | null;
            quantity: Prisma.Decimal;
            unitPriceUsd: Prisma.Decimal;
            lineTotalUsd: Prisma.Decimal;
            createdAt: Date;
            updatedAt: Date;
        }, unknown, never> & {})[];
    } & import("@prisma/client/runtime").GetResult<{
        id: string;
        companyId: string;
        customerId: string;
        createdByUserId: string;
        transactionDate: Date;
        currencyBase: string;
        exchangeCurrency: string | null;
        exchangeRate: Prisma.Decimal | null;
        exchangeNote: string | null;
        subtotalUsd: Prisma.Decimal;
        note: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, unknown, never> & {}>;
    getById(user: StaffUser, deliveryId: string): Promise<{
        items: (import("@prisma/client/runtime").GetResult<{
            id: string;
            deliveryId: string;
            customerId: string;
            productName: string;
            productSize: string | null;
            quantity: Prisma.Decimal;
            unitPriceUsd: Prisma.Decimal;
            lineTotalUsd: Prisma.Decimal;
            createdAt: Date;
            updatedAt: Date;
        }, unknown, never> & {})[];
    } & import("@prisma/client/runtime").GetResult<{
        id: string;
        companyId: string;
        customerId: string;
        createdByUserId: string;
        transactionDate: Date;
        currencyBase: string;
        exchangeCurrency: string | null;
        exchangeRate: Prisma.Decimal | null;
        exchangeNote: string | null;
        subtotalUsd: Prisma.Decimal;
        note: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, unknown, never> & {}>;
    remove(user: StaffUser, deliveryId: string): Promise<{
        message: string;
    }>;
    private normalize;
    private refreshProductMemories;
    private ensureCustomer;
    private ensureCanViewCustomers;
    private ensureCanCreateDeliveries;
    private ensureCanEditDeliveries;
}
export {};
