package com.accounting.app.ui.screens

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.accounting.app.data.api.ApiService
import com.accounting.app.data.api.DeliveryItemRequest
import com.accounting.app.data.api.NewDeliveryRequest
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

@Composable
fun NewDeliveryScreen(api: ApiService) {
    val customerId = remember { mutableStateOf("") }
    val urunAdi = remember { mutableStateOf("") }
    val boyut = remember { mutableStateOf("") }
    val miktar = remember { mutableStateOf("1") }
    val birimFiyat = remember { mutableStateOf("0") }
    val suggestions = remember { mutableStateOf<List<com.accounting.app.data.models.Product>>(emptyList()) }
    val result = remember { mutableStateOf<String?>(null) }
    val scope = rememberCoroutineScope()

    LaunchedEffect(urunAdi.value) {
        delay(350)
        if (urunAdi.value.length >= 2) {
            try {
                suggestions.value = api.productSuggest(urunAdi.value, 5)
            } catch (_: Exception) {
            }
        } else {
            suggestions.value = emptyList()
        }
    }

    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        Text("Yeni Teslimat", style = MaterialTheme.typography.headlineSmall)
        OutlinedTextField(
            value = customerId.value,
            onValueChange = { customerId.value = it },
            label = { Text("Musteri ID") },
            modifier = Modifier.fillMaxWidth().padding(top = 8.dp)
        )
        OutlinedTextField(
            value = urunAdi.value,
            onValueChange = { urunAdi.value = it },
            label = { Text("Urun Adi") },
            modifier = Modifier.fillMaxWidth().padding(top = 12.dp)
        )
        OutlinedTextField(
            value = boyut.value,
            onValueChange = { boyut.value = it },
            label = { Text("Boyut") },
            modifier = Modifier.fillMaxWidth().padding(top = 8.dp)
        )
        OutlinedTextField(
            value = miktar.value,
            onValueChange = { miktar.value = it },
            label = { Text("Miktar") },
            modifier = Modifier.fillMaxWidth().padding(top = 8.dp)
        )
        OutlinedTextField(
            value = birimFiyat.value,
            onValueChange = { birimFiyat.value = it },
            label = { Text("Birim Fiyat (USD)") },
            modifier = Modifier.fillMaxWidth().padding(top = 8.dp)
        )
        if (suggestions.value.isNotEmpty()) {
            Text(
                text = "Oneriler: " + suggestions.value.joinToString(" | ") { "${it.productName} ${it.productSize ?: ""} ${it.unitPriceUsd}" },
                modifier = Modifier.padding(top = 8.dp)
            )
        }
        Button(onClick = {
            scope.launch {
                try {
                    api.createDelivery(
                        NewDeliveryRequest(
                            customerId = customerId.value,
                            transactionDate = java.time.LocalDate.now().toString(),
                            items = listOf(
                                DeliveryItemRequest(
                                    productName = urunAdi.value,
                                    productSize = boyut.value.ifBlank { null },
                                    quantity = miktar.value.toDoubleOrNull() ?: 0.0,
                                    unitPriceUsd = birimFiyat.value.toDoubleOrNull() ?: 0.0
                                )
                            )
                        )
                    )
                    result.value = "Teslimat kaydedildi"
                } catch (e: Exception) {
                    result.value = "Hata: ${e.message}"
                }
            }
        }, modifier = Modifier.fillMaxWidth().padding(top = 12.dp)) {
            Text("Teslimati Kaydet")
        }
        if (result.value != null) {
            Text(result.value.orEmpty(), modifier = Modifier.padding(top = 8.dp))
        }
    }
}