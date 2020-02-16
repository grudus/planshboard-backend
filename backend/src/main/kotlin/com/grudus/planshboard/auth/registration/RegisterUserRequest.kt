package com.grudus.planshboard.auth.registration

data class RegisterUserRequest(val username: String, val password: String, val confirmPassword: String)
