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
import com.accounting.app.data.api.NewCustomerRequest
import kotlinx.coroutines.launch

@Composable
fun AddCustomerScreen(api: ApiService) {
    val adSoyad = remember { mutableStateOf("") }
    val telefon = remember { mutableStateOf("") }
    val eposta = remember { mutableStateOf("") }
    val adres = remember { mutableStateOf("") }
    val not = remember { mutableStateOf("") }
    val result = remember { mutableStateOf<String?>(null) }
    val scope = rememberCoroutineScope()

    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        Text("Yeni Musteri", style = MaterialTheme.typography.headlineSmall)
        OutlinedTextField(adSoyad.value, { adSoyad.value = it }, label = { Text("Ad Soyad") }, modifier = Modifier.fillMaxWidth().padding(top = 10.dp))
        OutlinedTextField(telefon.value, { telefon.value = it }, label = { Text("Telefon") }, modifier = Modifier.fillMaxWidth().padding(top = 8.dp))
        OutlinedTextField(eposta.value, { eposta.value = it }, label = { Text("E-Posta") }, modifier = Modifier.fillMaxWidth().padding(top = 8.dp))
        OutlinedTextField(adres.value, { adres.value = it }, label = { Text("Adres") }, modifier = Modifier.fillMaxWidth().padding(top = 8.dp))
        OutlinedTextField(not.value, { not.value = it }, label = { Text("Not") }, modifier = Modifier.fillMaxWidth().padding(top = 8.dp))
        Button(onClick = {
            scope.launch {
                try {
                    val res = api.addCustomer(
                        NewCustomerRequest(
                            fullName = adSoyad.value,
                            phone = telefon.value.ifBlank { null },
                            email = eposta.value.ifBlank { null },
                            address = adres.value.ifBlank { null },
                            notes = not.value.ifBlank { null }
                        )
                    )
                    val creds = res["credentials"]
                    result.value = "Musteri kaydedildi. Kimlik: $creds"
                } catch (e: Exception) {
                    result.value = "Hata: ${e.message}"
                }
            }
        }, modifier = Modifier.fillMaxWidth().padding(top = 12.dp)) {
            Text("Musteriyi Kaydet")
        }
        if (result.value != null) {
            Text(result.value.orEmpty(), modifier = Modifier.padding(top = 8.dp))
        }
    }
}