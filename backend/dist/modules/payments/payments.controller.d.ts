import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentsService } from './payments.service';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    list(req: any): Promise<(import("@prisma/client/runtime").GetResult<{
        id: string;
        companyId: string;
        customerId: string;
        enteredByUserId: string;
        paymentDate: Date;
        amountUsd: import("@prisma/client/runtime").Decimal;
        exchangeCurrency: string | null;
        exchangeRate: import("@prisma/client/runtime").Decimal | null;
        amountExchange: import("@prisma/client/runtime").Decimal | null;
        exchangeNote: string | null;
        paymentMethod: string;
        referenceNo: string | null;
        note: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, unknown, never> & {})[]>;
    create(req: any, dto: CreatePaymentDto): Promise<{
        payment: import("@prisma/client/runtime").GetResult<{
            id: string;
            companyId: string;
            customerId: string;
            enteredByUserId: string;
            paymentDate: Date;
            amountUsd: import("@prisma/client/runtime").Decimal;
            exchangeCurrency: string | null;
            exchangeRate: import("@prisma/client/runtime").Decimal | null;
            amountExchange: import("@prisma/client/runtime").Decimal | null;
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
    getById(req: any, paymentId: string): Promise<import("@prisma/client/runtime").GetResult<{
        id: string;
        companyId: string;
        customerId: string;
        enteredByUserId: string;
        paymentDate: Date;
        amountUsd: import("@prisma/client/runtime").Decimal;
        exchangeCurrency: string | null;
        exchangeRate: import("@prisma/client/runtime").Decimal | null;
        amountExchange: import("@prisma/client/runtime").Decimal | null;
        exchangeNote: string | null;
        paymentMethod: string;
        referenceNo: string | null;
        note: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, unknown, never> & {}>;
    remove(req: any, paymentId: string): Promise<{
        message: string;
    }>;
}
