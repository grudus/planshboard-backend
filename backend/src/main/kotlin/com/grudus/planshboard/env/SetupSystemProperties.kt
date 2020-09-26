package com.grudus.planshboard.env

object SetupSystemProperties {
    init {
        System.getProperties().setProperty("org.jooq.no-logo", "true")
    }
}
