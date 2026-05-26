package com.accounting.app.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.accounting.app.data.SessionManager
import com.accounting.app.data.api.ApiService
import com.accounting.app.ui.screens.AddCustomerScreen
import com.accounting.app.ui.screens.CustomerDetailScreen
import com.accounting.app.ui.screens.CustomerListScreen
import com.accounting.app.ui.screens.DashboardScreen
import com.accounting.app.ui.screens.EmployeeManagementScreen
import com.accounting.app.ui.screens.LoginScreen
import com.accounting.app.ui.screens.NewDeliveryScreen
import com.accounting.app.ui.screens.PaymentEntryScreen
import com.accounting.app.ui.screens.ReportsScreen

object Routes {
    const val LOGIN = "login"
    const val DASHBOARD = "dashboard"
    const val CUSTOMERS = "customers"
    const val CUSTOMER_DETAIL = "customer-detail/{customerId}"
    const val ADD_CUSTOMER = "add-customer"
    const val NEW_DELIVERY = "new-delivery"
    const val PAYMENT_ENTRY = "payment-entry"
    const val REPORTS = "reports"
    const val EMPLOYEES = "employees"
}

@Composable
fun NavGraph(api: ApiService, session: SessionManager) {
    val navController = rememberNavController()
    NavHost(
        navController = navController,
        startDestination = Routes.LOGIN
    ) {
        composable(Routes.LOGIN) {
            LoginScreen(api = api, session = session) { navController.navigate(Routes.DASHBOARD) }
        }
        composable(Routes.DASHBOARD) {
            DashboardScreen(api = api)
        }
        composable(Routes.CUSTOMERS) {
            CustomerListScreen(api = api) { customerId ->
                navController.navigate("customer-detail/$customerId")
            }
        }
        composable(Routes.CUSTOMER_DETAIL) {
            val customerId = it.arguments?.getString("customerId").orEmpty()
            CustomerDetailScreen(api = api, customerId = customerId)
        }
        composable(Routes.ADD_CUSTOMER) {
            AddCustomerScreen(api = api)
        }
        composable(Routes.NEW_DELIVERY) {
            NewDeliveryScreen(api = api)
        }
        composable(Routes.PAYMENT_ENTRY) {
            PaymentEntryScreen(api = api)
        }
        composable(Routes.REPORTS) {
            ReportsScreen(api = api)
        }
        composable(Routes.EMPLOYEES) {
            EmployeeManagementScreen(api = api)
        }
    }
}