package com.accounting.app.data.api

import com.accounting.app.data.models.Customer
import com.accounting.app.data.models.Delivery
import com.accounting.app.data.models.Payment
import com.accounting.app.data.models.Product
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Query

data class LoginRequest(val username: String, val password: String)
data class LoginResponse(val accessToken: String, val refreshToken: String, val tokenType: String)
data class DashboardResponse(
    val bugunkuTeslimatlar: Int,
    val bugunkuOdemeler: Int,
    val toplamAlacak: Double,
    val musteriSayisi: Int
)
data class EmployeeSummary(
    val id: String,
    val fullName: String,
    val username: String? = null
)
data class DeliveryItemRequest(
    val productName: String,
    val productSize: String?,
    val quantity: Double,
    val unitPriceUsd: Double
)
data class NewDeliveryRequest(
    val customerId: String,
    val transactionDate: String,
    val items: List<DeliveryItemRequest>
)
data class NewPaymentRequest(
    val customerId: String,
    val paymentDate: String,
    val amountUsd: Double,
    val paymentMethod: String,
    val referenceNo: String? = null,
    val note: String? = null
)
data class NewCustomerRequest(
    val fullName: String,
    val phone: String?,
    val email: String?,
    val address: String?,
    val notes: String?
)

interface ApiService {
    @POST("auth/login")
    suspend fun login(@Body body: LoginRequest): LoginResponse

    @GET("reports/customer-summary")
    suspend fun customerSummary(@Query("customerId") customerId: String): Map<String, Any>

    @GET("customers")
    suspend fun customers(): List<Customer>

    @POST("customers")
    suspend fun addCustomer(@Body body: NewCustomerRequest): Map<String, Any>

    @GET("deliveries")
    suspend fun deliveries(): List<Delivery>

    @POST("deliveries")
    suspend fun createDelivery(@Body body: NewDeliveryRequest): Map<String, Any>

    @GET("payments")
    suspend fun payments(): List<Payment>

    @POST("payments")
    suspend fun createPayment(@Body body: NewPaymentRequest): Map<String, Any>

    @GET("product-memories/suggest")
    suspend fun productSuggest(@Query("q") q: String, @Query("limit") limit: Int = 5): List<Product>

    @GET("reports/monthly")
    suspend fun monthlyReport(
        @Query("customerId") customerId: String,
        @Query("year") year: Int,
        @Query("month") month: Int
    ): Map<String, Any>

    @GET("employees")
    suspend fun employees(): List<EmployeeSummary>
}