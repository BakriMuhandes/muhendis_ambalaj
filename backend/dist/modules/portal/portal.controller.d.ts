import { Response } from 'express';
import { ReportsExportService } from '../reports/reports-export.service';
import { PortalService } from './portal.service';
export declare class PortalController {
    private readonly portalService;
    private readonly reportsExportService;
    constructor(portalService: PortalService, reportsExportService: ReportsExportService);
    dashboard(req: any): Promise<{
        guncelBorcUsd: number;
        toplamTeslimatUsd: number;
        toplamOdemeUsd: number;
        sonIslemTarihi: string | null;
    }>;
    deliveries(req: any, from?: string, to?: string): Promise<({
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
    payments(req: any, from?: string, to?: string): Promise<(import("@prisma/client/runtime").GetResult<{
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
    monthly(req: any, year: string, month: string): Promise<{
        reportType: string;
        customer: {
            id: string;
            fullName: string;
        };
        period: {
            from: string;
            to: string;
        };
        deliveries: ({
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
        }, unknown, never> & {})[];
        payments: (import("@prisma/client/runtime").GetResult<{
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
        }, unknown, never> & {})[];
        ledger: {
            date: string;
            type: "teslimat" | "odeme";
            description: string;
            debtUsd: number;
            paymentUsd: number;
            balanceUsd: number;
        }[];
        totals: {
            totalDebtUsd: number;
            totalPaymentUsd: number;
            balanceUsd: number;
        };
        charts: {
            monthly: {
                bakiyeDegisim: number;
                label: string;
                teslimat: number;
                odeme: number;
            }[];
        };
        generatedAt: string;
    }>;
    yearly(req: any, year: string): Promise<{
        reportType: string;
        customer: {
            id: string;
            fullName: string;
        };
        period: {
            from: string;
            to: string;
        };
        deliveries: ({
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
        }, unknown, never> & {})[];
        payments: (import("@prisma/client/runtime").GetResult<{
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
        }, unknown, never> & {})[];
        ledger: {
            date: string;
            type: "teslimat" | "odeme";
            description: string;
            debtUsd: number;
            paymentUsd: number;
            balanceUsd: number;
        }[];
        totals: {
            totalDebtUsd: number;
            totalPaymentUsd: number;
            balanceUsd: number;
        };
        charts: {
            monthly: {
                bakiyeDegisim: number;
                label: string;
                teslimat: number;
                odeme: number;
            }[];
        };
        generatedAt: string;
    }>;
    custom(req: any, from: string, to: string): Promise<{
        reportType: string;
        customer: {
            id: string;
            fullName: string;
        };
        period: {
            from: string;
            to: string;
        };
        deliveries: ({
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
        }, unknown, never> & {})[];
        payments: (import("@prisma/client/runtime").GetResult<{
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
        }, unknown, never> & {})[];
        ledger: {
            date: string;
            type: "teslimat" | "odeme";
            description: string;
            debtUsd: number;
            paymentUsd: number;
            balanceUsd: number;
        }[];
        totals: {
            totalDebtUsd: number;
            totalPaymentUsd: number;
            balanceUsd: number;
        };
        charts: {
            monthly: {
                bakiyeDegisim: number;
                label: string;
                teslimat: number;
                odeme: number;
            }[];
        };
        generatedAt: string;
    }>;
    exportXlsx(req: any, res: Response, type: 'monthly' | 'yearly' | 'custom', from?: string, to?: string, year?: string, month?: string): Promise<Response<any, Record<string, any>>>;
    exportPrint(req: any, type: 'monthly' | 'yearly' | 'custom', from?: string, to?: string, year?: string, month?: string): Promise<{
        reportType: string;
        customer: {
            id: string;
            fullName: string;
        };
        period: {
            from: string;
            to: string;
        };
        deliveries: ({
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
        }, unknown, never> & {})[];
        payments: (import("@prisma/client/runtime").GetResult<{
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
        }, unknown, never> & {})[];
        ledger: {
            date: string;
            type: "teslimat" | "odeme";
            description: string;
            debtUsd: number;
            paymentUsd: number;
            balanceUsd: number;
        }[];
        totals: {
            totalDebtUsd: number;
            totalPaymentUsd: number;
            balanceUsd: number;
        };
        charts: {
            monthly: {
                bakiyeDegisim: number;
                label: string;
                teslimat: number;
                odeme: number;
            }[];
        };
        generatedAt: string;
    }>;
}
