package com.grudus.planshboard.env

import java.util.*

object SetupSystemProperties {
    init {
        System.getProperties().setProperty("org.jooq.no-logo", "true")
        TimeZone.setDefault(TimeZone.getTimeZone("UTC"))
    }
}
