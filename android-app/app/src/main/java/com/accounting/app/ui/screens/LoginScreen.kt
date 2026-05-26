package com.accounting.app.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.TextButton
import androidx.compose.material3.Text
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.Composable
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import com.accounting.app.R
import com.accounting.app.data.SessionManager
import com.accounting.app.data.api.ApiService
import kotlinx.coroutines.launch

@Composable
fun LoginScreen(
    api: ApiService,
    session: SessionManager,
    onSuccess: () -> Unit = {}
) {
    val username = remember { mutableStateOf("") }
    val password = remember { mutableStateOf("") }
    val loading = remember { mutableStateOf(false) }
    val error = remember { mutableStateOf<String?>(null) }
    val scope = rememberCoroutineScope()

    LaunchedEffect(Unit) {
        if (!session.getToken().isNullOrBlank()) onSuccess()
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        verticalArrangement = Arrangement.Center
    ) {
        Text(
            text = stringResource(id = R.string.giris_baslik),
            style = MaterialTheme.typography.headlineSmall,
            modifier = Modifier.padding(bottom = 16.dp)
        )

        OutlinedTextField(
            value = username.value,
            onValueChange = { username.value = it },
            modifier = Modifier.fillMaxWidth(),
            label = { Text(stringResource(id = R.string.kullanici_adi)) },
            singleLine = true
        )

        OutlinedTextField(
            value = password.value,
            onValueChange = { password.value = it },
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = 12.dp),
            label = { Text(stringResource(id = R.string.sifre)) },
            visualTransformation = PasswordVisualTransformation(),
            singleLine = true
        )

        Button(
            onClick = {
                scope.launch {
                    loading.value = true
                    error.value = null
                    try {
                        val res = api.login(
                            com.accounting.app.data.api.LoginRequest(
                                username = username.value.trim(),
                                password = password.value
                            )
                        )
                        session.saveToken(res.accessToken)
                        onSuccess()
                    } catch (e: Exception) {
                        error.value = e.message ?: "Giris basarisiz"
                    } finally {
                        loading.value = false
                    }
                }
            },
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = 20.dp)
        ) {
            Text(text = if (loading.value) "Giris Yapiliyor..." else stringResource(id = R.string.giris_yap))
        }
        if (error.value != null) {
            Text(
                text = error.value.orEmpty(),
                color = MaterialTheme.colorScheme.error,
                modifier = Modifier.padding(top = 8.dp)
            )
        }
        TextButton(onClick = { session.clear() }, modifier = Modifier.padding(top = 4.dp)) {
            Text("Oturumu Temizle")
        }
    }
}