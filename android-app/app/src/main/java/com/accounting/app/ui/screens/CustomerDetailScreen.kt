package com.accounting.app.ui.screens

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.accounting.app.data.api.ApiService

@Composable
fun CustomerDetailScreen(api: ApiService, customerId: String = "") {
    val summary = remember { mutableStateOf<Map<String, Any>?>(null) }
    val error = remember { mutableStateOf<String?>(null) }
    LaunchedEffect(customerId) {
        if (customerId.isNotBlank()) {
            try {
                summary.value = api.customerSummary(customerId)
            } catch (e: Exception) {
                error.value = e.message
            }
        }
    }

    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        Text("Musteri Detayi", style = MaterialTheme.typography.headlineSmall)
        Text("Musteri ID: $customerId", modifier = Modifier.padding(top = 8.dp))
        if (summary.value != null) {
            Text("Toplam Borc: ${summary.value!!["totalDebtUsd"]}", modifier = Modifier.padding(top = 8.dp))
            Text("Toplam Odeme: ${summary.value!!["totalPaymentUsd"]}", modifier = Modifier.padding(top = 4.dp))
            Text("Guncel Bakiye: ${summary.value!!["balanceUsd"]}", modifier = Modifier.padding(top = 4.dp))
        }
        if (error.value != null) {
            Text(
                text = "Detay alinamadi: ${error.value}",
                color = MaterialTheme.colorScheme.error,
                modifier = Modifier.padding(top = 8.dp)
            )
        }
    }
}