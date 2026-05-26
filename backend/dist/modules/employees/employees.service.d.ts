import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdatePermissionsDto } from './dto/update-permissions.dto';
type StaffUser = {
    sub: string;
    companyId: string;
    role: 'admin' | 'employee';
    type: 'staff';
};
export declare class EmployeesService {
    private readonly prisma;
    list(user: StaffUser): Promise<({
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
    create(user: StaffUser, dto: CreateEmployeeDto): Promise<{
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
    updatePermissions(user: StaffUser, employeeId: string, dto: UpdatePermissionsDto): Promise<import("@prisma/client/runtime").GetResult<{
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
    private ensureCanManageEmployees;
}
export {};
