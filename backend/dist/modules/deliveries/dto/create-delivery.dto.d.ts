declare class CreateDeliveryItemDto {
    productName: string;
    productSize?: string;
    quantity: number;
    unitPriceUsd: number;
}
export declare class CreateDeliveryDto {
    customerId: string;
    transactionDate?: string;
    exchangeCurrency?: string;
    exchangeRate?: number;
    exchangeNote?: string;
    note?: string;
    items: CreateDeliveryItemDto[];
}
export {};
