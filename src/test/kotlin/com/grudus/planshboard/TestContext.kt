package com.grudus.planshboard

import com.github.benmanes.caffeine.cache.Caffeine
import com.grudus.planshboard.TestConstants.NUMBER_OF_ITEMS_IN_CACHE
import com.grudus.planshboard.configuration.spring.PlanshboardContext
import com.grudus.planshboard.env.EnvironmentKeys
import com.grudus.planshboard.env.EnvironmentService
import org.mockito.Mockito
import org.springframework.boot.jdbc.DataSourceBuilder
import org.springframework.cache.annotation.EnableCaching
import org.springframework.context.annotation.*
import org.springframework.core.env.Environment
import java.util.concurrent.TimeUnit
import javax.sql.DataSource

@Configuration
@Import(PlanshboardContext::class)
@EnableCaching
@PropertySource("classpath:/application.properties")
@ComponentScan("com.grudus.planshboard")
class TestContext {

    @Bean
    @Primary
    fun primaryDataSource(env: EnvironmentService): DataSource =
        DataSourceBuilder.create()
            .url(env.getText(EnvironmentKeys.SPRING_DATASOURCE_URL))
            .username(env.getText(EnvironmentKeys.SPRING_DATASOURCE_USERNAME))
            .password(env.getText(EnvironmentKeys.SPRING_DATASOURCE_PASSWORD))
            .driverClassName(env.getText(EnvironmentKeys.SPRING_DATASOURCE_DRIVER_CLASS_NAME))
            .build()

    @Bean
    @Primary
    fun environmentService(env: Environment): EnvironmentService {
        val service = EnvironmentService(env)
        return Mockito.spy(service)
    }

    @Bean
    @Primary
    fun caffeine(): Caffeine<Any, Any> {
        return Caffeine.newBuilder()
            .maximumSize(NUMBER_OF_ITEMS_IN_CACHE)
            .recordStats()
    }
}
