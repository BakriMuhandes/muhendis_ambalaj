package com.accounting.app.data.models

data class Product(
    val productName: String,
    val productSize: String? = null,
    val unitPriceUsd: Double
)