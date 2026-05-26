package com.accounting.app.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.Card
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
fun DashboardScreen(api: ApiService) {
    val bugunkuTeslimatlar = remember { mutableStateOf(0) }
    val bugunkuOdemeler = remember { mutableStateOf(0) }
    val toplamAlacak = remember { mutableStateOf(0.0) }
    val musteriSayisi = remember { mutableStateOf(0) }

    LaunchedEffect(Unit) {
        try {
            val deliveries = api.deliveries()
            val payments = api.payments()
            val customers = api.customers()
            val today = java.time.LocalDate.now().toString()
            bugunkuTeslimatlar.value = deliveries.count { it.transactionDate.startsWith(today) }
            bugunkuOdemeler.value = payments.count { it.paymentDate.startsWith(today) }
            toplamAlacak.value = deliveries.sumOf { it.subtotalUsd } - payments.sumOf { it.amountUsd }
            musteriSayisi.value = customers.size
        } catch (_: Exception) {
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Text("Panel", style = MaterialTheme.typography.headlineSmall)
        DashboardCard("Bugunku Teslimatlar", bugunkuTeslimatlar.value.toString())
        DashboardCard("Bugunku Odemeler", bugunkuOdemeler.value.toString())
        DashboardCard("Toplam Alacak", "${"%.2f".format(toplamAlacak.value)} USD")
        DashboardCard("Musteri Sayisi", musteriSayisi.value.toString())
        Button(onClick = {}, modifier = Modifier.fillMaxWidth()) { Text("Yeni Teslimat") }
    }
}

@Composable
private fun DashboardCard(title: String, value: String) {
    Card(modifier = Modifier.fillMaxWidth()) {
        Column(modifier = Modifier.padding(14.dp)) {
            Text(title, style = MaterialTheme.typography.labelLarge)
            Text(value, style = MaterialTheme.typography.titleMedium)
        }
    }
}