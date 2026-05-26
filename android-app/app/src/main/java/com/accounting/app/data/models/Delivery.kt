package com.accounting.app.data.models

data class Delivery(
    val id: String,
    val customerId: String,
    val transactionDate: String,
    val subtotalUsd: Double
)