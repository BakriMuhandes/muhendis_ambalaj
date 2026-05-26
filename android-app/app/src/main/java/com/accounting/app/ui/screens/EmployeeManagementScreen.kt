package com.accounting.app.ui.screens

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

@Composable
fun EmployeeManagementScreen(api: ApiService) {
    val employees = remember { mutableStateOf<List<com.accounting.app.data.api.EmployeeSummary>>(emptyList()) }

    LaunchedEffect(Unit) {
        try {
            employees.value = api.employees()
        } catch (_: Exception) {
        }
    }

    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        Text("Calisan Yonetimi", style = MaterialTheme.typography.headlineSmall)
        Text("Calisan listesi ve yetki ayarlari", modifier = Modifier.padding(top = 8.dp))
        LazyColumn(modifier = Modifier.padding(top = 12.dp)) {
            items(employees.value) { row ->
                Card(modifier = Modifier.fillMaxWidth().padding(bottom = 8.dp)) {
                    Column(modifier = Modifier.padding(12.dp)) {
                        Text(row.fullName)
                        Text("ID: ${row.id}")
                    }
                }
            }
        }
    }
}