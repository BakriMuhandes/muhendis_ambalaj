import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdatePermissionsDto } from './dto/update-permissions.dto';
import { EmployeesService } from './employees.service';
export declare class EmployeesController {
    private readonly employeesService;
    constructor(employeesService: EmployeesService);
    list(req: any): Promise<({
        employeePermission: (import("@prisma/client/runtime").GetResult<{
            id: string;
            userId: string;
            canViewCustomers: boolean;
            canCreateCustomers: boolean;
            canCreateDeliveries: boolean;
            canEditDeliveries: boolean;
            canCreatePayments: boolean;
            canViewReports: boolean;
            canExportReports: boolean;
            canManageEmployees: boolean;
            canManageSettings: boolean;
            createdAt: Date;
            updatedAt: Date;
        }, unknown, never> & {}) | null;
    } & import("@prisma/client/runtime").GetResult<{
        id: string;
        companyId: string;
        fullName: string;
        username: string;
        passwordHash: string;
        role: import(".prisma/client").UserRole;
        isActive: boolean;
        lastLoginAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }, unknown, never> & {})[]>;
    create(req: any, dto: CreateEmployeeDto): Promise<{
        employee: {
            id: string;
            companyId: string;
            fullName: string;
            username: string;
            role: import(".prisma/client").UserRole;
            isActive: boolean;
        };
        permission: import("@prisma/client/runtime").GetResult<{
            id: string;
            userId: string;
            canViewCustomers: boolean;
            canCreateCustomers: boolean;
            canCreateDeliveries: boolean;
            canEditDeliveries: boolean;
            canCreatePayments: boolean;
            canViewReports: boolean;
            canExportReports: boolean;
            canManageEmployees: boolean;
            canManageSettings: boolean;
            createdAt: Date;
            updatedAt: Date;
        }, unknown, never> & {};
        credentials: {
            username: string;
            password: string;
        };
    }>;
    updatePermissions(req: any, employeeId: string, dto: UpdatePermissionsDto): Promise<import("@prisma/client/runtime").GetResult<{
        id: string;
        userId: string;
        canViewCustomers: boolean;
        canCreateCustomers: boolean;
        canCreateDeliveries: boolean;
        canEditDeliveries: boolean;
        canCreatePayments: boolean;
        canViewReports: boolean;
        canExportReports: boolean;
        canManageEmployees: boolean;
        canManageSettings: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, unknown, never> & {}>;
}
