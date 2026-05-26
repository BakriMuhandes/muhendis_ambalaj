package com.accounting.app.ui.screens

import androidx.compose.foundation.layout.Arrangement
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
import kotlinx.coroutines.launch

@Composable
fun ReportsScreen(api: ApiService) {
    val customerId = remember { mutableStateOf("") }
    val year = remember { mutableStateOf(java.time.LocalDate.now().year.toString()) }
    val month = remember { mutableStateOf(java.time.LocalDate.now().monthValue.toString()) }
    val output = remember { mutableStateOf<String?>(null) }
    val scope = rememberCoroutineScope()

    Column(
        modifier = Modifier.fillMaxSize().padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(10.dp)
    ) {
        Text("Raporlar", style = MaterialTheme.typography.headlineSmall)
        OutlinedTextField(
            value = customerId.value,
            onValueChange = { customerId.value = it },
            label = { Text("Musteri ID") },
            modifier = Modifier.fillMaxWidth()
        )
        OutlinedTextField(
            value = year.value,
            onValueChange = { year.value = it },
            label = { Text("Yil") },
            modifier = Modifier.fillMaxWidth()
        )
        OutlinedTextField(
            value = month.value,
            onValueChange = { month.value = it },
            label = { Text("Ay") },
            modifier = Modifier.fillMaxWidth()
        )
        Button(onClick = {
            scope.launch {
                try {
                    val res = api.monthlyReport(
                        customerId = customerId.value,
                        year = year.value.toInt(),
                        month = month.value.toInt()
                    )
                    output.value = "Aylik rapor alindi: ${res["period"]}"
                } catch (e: Exception) {
                    output.value = "Hata: ${e.message}"
                }
            }
        }, modifier = Modifier.fillMaxWidth()) { Text("Aylik Rapor") }
        if (output.value != null) {
            Text(output.value.orEmpty())
        }
    }
}