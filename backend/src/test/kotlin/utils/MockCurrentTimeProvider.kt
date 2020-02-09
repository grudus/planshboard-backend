package utils

import com.grudus.planshboard.commons.CurrentTimeProvider
import java.time.Clock
import java.time.LocalDateTime
import java.time.ZoneId

class MockCurrentTimeProvider : CurrentTimeProvider {
    private val zoneId = ZoneId.systemDefault()
    private var clock: Clock = Clock.systemDefaultZone()

    fun setDate(date: LocalDateTime) {
        clock = Clock.fixed(date.atZone(zoneId).toInstant(), zoneId)
    }

    override fun now(): LocalDateTime = LocalDateTime.now(clock)
}
