package com.accounting.app.data.models

data class Payment(
    val id: String,
    val customerId: String,
    val paymentDate: String,
    val amountUsd: Double,
    val paymentMethod: String
)