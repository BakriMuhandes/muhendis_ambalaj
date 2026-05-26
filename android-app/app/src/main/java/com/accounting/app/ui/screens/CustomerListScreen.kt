package com.accounting.app.ui.screens

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
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
import com.accounting.app.data.models.Customer

@Composable
fun CustomerListScreen(api: ApiService, onSelect: (String) -> Unit = {}) {
    val customers = remember { mutableStateOf<List<Customer>>(emptyList()) }
    val error = remember { mutableStateOf<String?>(null) }

    LaunchedEffect(Unit) {
        try {
            customers.value = api.customers()
        } catch (e: Exception) {
            error.value = e.message
        }
    }
    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        Text("Musteriler", style = MaterialTheme.typography.headlineSmall)
        if (error.value != null) {
            Text(
                text = "Veri alinamadi: ${error.value}",
                color = MaterialTheme.colorScheme.error,
                modifier = Modifier.padding(top = 8.dp, bottom = 8.dp)
            )
        }
        LazyColumn(modifier = Modifier.padding(top = 12.dp)) {
            items(customers.value) { customer ->
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(bottom = 8.dp)
                        .clickable { onSelect(customer.id) }
                ) {
                    Column(modifier = Modifier.padding(12.dp)) {
                        Text(customer.fullName, style = MaterialTheme.typography.titleMedium)
                    }
                }
            }
        }
    }
}