package com.accounting.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import com.accounting.app.data.SessionManager
import com.accounting.app.data.api.ApiClient
import com.accounting.app.navigation.NavGraph

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val session = SessionManager(this)
        val api = ApiClient.create { session.getToken() }
        setContent {
            MaterialTheme {
                Surface {
                    NavGraph(api = api, session = session)
                }
            }
        }
    }
}