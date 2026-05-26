package com.accounting.app.data.models

data class Customer(
    val id: String,
    val fullName: String,
    val phone: String? = null,
    val email: String? = null,
    val balanceUsd: Double? = null
)