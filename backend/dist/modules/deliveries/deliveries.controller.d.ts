import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { DeliveriesService } from './deliveries.service';
export declare class DeliveriesController {
    private readonly deliveriesService;
    constructor(deliveriesService: DeliveriesService);
    list(req: any): Promise<({
        items: (import("@prisma/client/runtime").GetResult<{
            id: string;
            deliveryId: string;
            customerId: string;
            productName: string;
            productSize: string | null;
            quantity: import("@prisma/client/runtime").Decimal;
            unitPriceUsd: import("@prisma/client/runtime").Decimal;
            lineTotalUsd: import("@prisma/client/runtime").Decimal;
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
        exchangeRate: import("@prisma/client/runtime").Decimal | null;
        exchangeNote: string | null;
        subtotalUsd: import("@prisma/client/runtime").Decimal;
        note: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, unknown, never> & {})[]>;
    create(req: any, dto: CreateDeliveryDto): Promise<{
        items: (import("@prisma/client/runtime").GetResult<{
            id: string;
            deliveryId: string;
            customerId: string;
            productName: string;
            productSize: string | null;
            quantity: import("@prisma/client/runtime").Decimal;
            unitPriceUsd: import("@prisma/client/runtime").Decimal;
            lineTotalUsd: import("@prisma/client/runtime").Decimal;
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
        exchangeRate: import("@prisma/client/runtime").Decimal | null;
        exchangeNote: string | null;
        subtotalUsd: import("@prisma/client/runtime").Decimal;
        note: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, unknown, never> & {}>;
    getById(req: any, deliveryId: string): Promise<{
        items: (import("@prisma/client/runtime").GetResult<{
            id: string;
            deliveryId: string;
            customerId: string;
            productName: string;
            productSize: string | null;
            quantity: import("@prisma/client/runtime").Decimal;
            unitPriceUsd: import("@prisma/client/runtime").Decimal;
            lineTotalUsd: import("@prisma/client/runtime").Decimal;
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
        exchangeRate: import("@prisma/client/runtime").Decimal | null;
        exchangeNote: string | null;
        subtotalUsd: import("@prisma/client/runtime").Decimal;
        note: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, unknown, never> & {}>;
    remove(req: any, deliveryId: string): Promise<{
        message: string;
    }>;
}
