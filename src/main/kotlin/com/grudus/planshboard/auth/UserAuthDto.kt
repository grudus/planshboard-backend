package com.grudus.planshboard.auth

data class UserAuthDto(val id: Long,
                       val username: String,
                       val passwordHash: String)
