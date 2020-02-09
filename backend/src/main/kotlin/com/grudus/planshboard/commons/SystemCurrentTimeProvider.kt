package com.grudus.planshboard.commons

import java.time.LocalDateTime

class SystemCurrentTimeProvider: CurrentTimeProvider {
    override fun now(): LocalDateTime = LocalDateTime.now()
}
