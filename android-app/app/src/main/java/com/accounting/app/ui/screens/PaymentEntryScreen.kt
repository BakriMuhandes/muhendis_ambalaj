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
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.accounting.app.data.api.ApiService
import com.accounting.app.data.api.NewPaymentRequest
import kotlinx.coroutines.launch

@Composable
fun PaymentEntryScreen(api: ApiService) {
    val customerId = remember { mutableStateOf("") }
    val tutar = remember { mutableStateOf("") }
    val yontem = remember { mutableStateOf("") }
    val referans = remember { mutableStateOf("") }
    val not = remember { mutableStateOf("") }
    val sonuc = remember { mutableStateOf<String?>(null) }
    val scope = rememberCoroutineScope()

    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        Text("Odeme Girisi", style = MaterialTheme.typography.headlineSmall)
        OutlinedTextField(customerId.value, { customerId.value = it }, label = { Text("Musteri ID") }, modifier = Modifier.fillMaxWidth().padding(top = 10.dp))
        OutlinedTextField(tutar.value, { tutar.value = it }, label = { Text("Odeme Tutari (USD)") }, modifier = Modifier.fillMaxWidth().padding(top = 12.dp))
        OutlinedTextField(yontem.value, { yontem.value = it }, label = { Text("Odeme Yontemi") }, modifier = Modifier.fillMaxWidth().padding(top = 8.dp))
        OutlinedTextField(referans.value, { referans.value = it }, label = { Text("Referans No") }, modifier = Modifier.fillMaxWidth().padding(top = 8.dp))
        OutlinedTextField(not.value, { not.value = it }, label = { Text("Not") }, modifier = Modifier.fillMaxWidth().padding(top = 8.dp))
        Button(onClick = {
            scope.launch {
                try {
                    api.createPayment(
                        NewPaymentRequest(
                            customerId = customerId.value,
                            paymentDate = java.time.LocalDate.now().toString(),
                            amountUsd = tutar.value.toDoubleOrNull() ?: 0.0,
                            paymentMethod = yontem.value,
                            referenceNo = referans.value.ifBlank { null },
                            note = not.value.ifBlank { null }
                        )
                    )
                    sonuc.value = "Odeme kaydedildi"
                } catch (e: Exception) {
                    sonuc.value = "Hata: ${e.message}"
                }
            }
        }, modifier = Modifier.fillMaxWidth().padding(top = 12.dp)) { Text("Odemeyi Kaydet") }
        if (sonuc.value != null) {
            Text(sonuc.value.orEmpty(), modifier = Modifier.padding(top = 8.dp))
        }
    }
}