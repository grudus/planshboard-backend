package com.grudus.planshboard.configuration.spring

import com.grudus.planshboard.commons.CurrentTimeProvider
import com.grudus.planshboard.commons.SystemCurrentTimeProvider
import com.grudus.planshboard.commons.cache.CacheConfig
import com.grudus.planshboard.commons.datasource.DataSourceConfig
import com.grudus.planshboard.env.EnvironmentKeys.FRONTEND_ADDRESS
import com.grudus.planshboard.env.EnvironmentService
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Import
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder


@Configuration
@EnableGlobalMethodSecurity(prePostEnabled = true)
@Import(value = [CacheConfig::class, DataSourceConfig::class])
class PlanshboardContext {

    @Bean
    fun passwordEncoder(): PasswordEncoder =
        BCryptPasswordEncoder(12)

    @Bean
    fun allowedOrigins(env: EnvironmentService): List<String> =
        env.getList(FRONTEND_ADDRESS)

    @Bean
    fun currentTimeProvider(): CurrentTimeProvider = SystemCurrentTimeProvider()
}
