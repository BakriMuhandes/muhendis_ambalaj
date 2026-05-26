type StaffUser = {
    sub: string;
    companyId: string;
    role: 'admin' | 'employee';
    type: 'staff';
};
export declare class ReportsService {
    private readonly prisma;
    customerSummary(user: StaffUser, customerId: string): Promise<{
        totalDebtUsd: number;
        totalPaymentUsd: number;
        balanceUsd: number;
        customer: {
            id: string;
            fullName: string;
        };
    }>;
    customerLedger(user: StaffUser, customerId: string, from?: string, to?: string): Promise<{
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
    monthly(user: StaffUser, customerId: string, year: string, month: string): Promise<{
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
    yearly(user: StaffUser, customerId: string, year: string): Promise<{
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
    custom(user: StaffUser, customerId: string, from: string, to: string): Promise<{
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
    exportPrint(user: StaffUser, customerId: string, type: 'monthly' | 'yearly' | 'custom', from?: string, to?: string, year?: string, month?: string): Promise<{
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
    private buildReport;
    private buildLedger;
    private buildChartData;
    private buildTotals;
    private resolveMonthlyPeriod;
    private resolveYearlyPeriod;
    private resolveCustomPeriod;
    private resolvePeriod;
    private ensureCustomer;
    private ensureCanViewReports;
}
export {};
