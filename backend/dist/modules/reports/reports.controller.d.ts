import { Response } from 'express';
import { ReportsExportService } from './reports-export.service';
import { ReportsService } from './reports.service';
export declare class ReportsController {
    private readonly reportsService;
    private readonly reportsExportService;
    constructor(reportsService: ReportsService, reportsExportService: ReportsExportService);
    customerSummary(req: any, customerId: string): Promise<{
        totalDebtUsd: number;
        totalPaymentUsd: number;
        balanceUsd: number;
        customer: {
            id: string;
            fullName: string;
        };
    }>;
    customerLedger(req: any, customerId: string, from?: string, to?: string): Promise<{
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
    monthly(req: any, customerId: string, year: string, month: string): Promise<{
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
    yearly(req: any, customerId: string, year: string): Promise<{
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
    custom(req: any, customerId: string, from: string, to: string): Promise<{
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
    exportXlsx(req: any, res: Response, customerId: string, type: 'monthly' | 'yearly' | 'custom', from?: string, to?: string, year?: string, month?: string): Promise<Response<any, Record<string, any>>>;
    exportPrint(req: any, customerId: string, type: 'monthly' | 'yearly' | 'custom', from?: string, to?: string, year?: string, month?: string): Promise<{
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
