export declare class CreatePaymentDto {
    customerId: string;
    paymentDate?: string;
    amountUsd: number;
    exchangeCurrency?: string;
    exchangeRate?: number;
    amountExchange?: number;
    exchangeNote?: string;
    paymentMethod: string;
    referenceNo?: string;
    note?: string;
}
