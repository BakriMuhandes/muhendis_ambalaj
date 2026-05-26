import { ProductMemoriesService } from './product-memories.service';
export declare class ProductMemoriesController {
    private readonly productMemoriesService;
    constructor(productMemoriesService: ProductMemoriesService);
    suggest(req: any, q?: string, limit?: string): Promise<(import("@prisma/client/runtime").GetResult<{
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
}
