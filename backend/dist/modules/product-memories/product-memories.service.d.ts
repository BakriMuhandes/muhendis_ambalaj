type StaffUser = {
    sub: string;
    companyId: string;
    role: 'admin' | 'employee';
    type: 'staff';
};
export declare class ProductMemoriesService {
    private readonly prisma;
    suggest(user: StaffUser, query: string, limit?: number): Promise<(import("@prisma/client/runtime").GetResult<{
        id: string;
        companyId: string;
        normalizedKey: string;
        displayName: string;
        sizeLabel: string | null;
        defaultUnit: string | null;
        lastUsedPriceUsd: import("@prisma/client/runtime").Decimal;
        usageCount: number;
        lastUsedAt: Date | null;
        createdByUserId: string;
        createdAt: Date;
        updatedAt: Date;
    }, unknown, never> & {})[]>;
    private normalize;
    private ensureCanCreateDeliveries;
}
export {};
