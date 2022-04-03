package com.grudus.planshboard.commons

import java.time.LocalDateTime

interface CurrentTimeProvider {
    fun now(): LocalDateTime
}
