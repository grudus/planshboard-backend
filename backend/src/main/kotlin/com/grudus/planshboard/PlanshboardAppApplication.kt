package com.grudus.planshboard

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration
import org.springframework.boot.runApplication

@SpringBootApplication(exclude = [UserDetailsServiceAutoConfiguration::class])
class PlanshboardAppApplication

fun main(args: Array<String>) {
    runApplication<PlanshboardAppApplication>(*args)
}
