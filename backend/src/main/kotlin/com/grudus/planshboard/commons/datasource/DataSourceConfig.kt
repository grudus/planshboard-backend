package com.grudus.planshboard.commons.datasource

import com.grudus.planshboard.env.EnvironmentKeys
import com.grudus.planshboard.env.EnvironmentService
import org.jooq.ConnectionProvider
import org.jooq.SQLDialect
import org.jooq.impl.DataSourceConnectionProvider
import org.jooq.impl.DefaultDSLContext
import org.springframework.boot.jdbc.DataSourceBuilder
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.jdbc.datasource.DataSourceTransactionManager
import org.springframework.jdbc.datasource.TransactionAwareDataSourceProxy
import org.springframework.transaction.annotation.EnableTransactionManagement
import javax.sql.DataSource

@Configuration
@EnableTransactionManagement
class DataSourceConfig {

    @Bean
    fun primaryDataSource(
        env: EnvironmentService,
    ): DataSource =
        DataSourceBuilder.create()
            .url(env.getText(EnvironmentKeys.SPRING_DATASOURCE_URL))
            .username(env.getText(EnvironmentKeys.SPRING_DATASOURCE_USERNAME))
            .password(env.getText(EnvironmentKeys.SPRING_DATASOURCE_PASSWORD))
            .driverClassName(env.getText(EnvironmentKeys.SPRING_DATASOURCE_DRIVER_CLASS_NAME))
            .build()

    @Bean
    fun transactionManager(dataSource: DataSource): DataSourceTransactionManager =
        DataSourceTransactionManager(dataSource)

    @Bean
    fun connectionProvider(dataSource: DataSource): DataSourceConnectionProvider =
        DataSourceConnectionProvider(TransactionAwareDataSourceProxy(dataSource) as DataSource?)

    @Bean
    fun dsl(connectionProvider: ConnectionProvider): DefaultDSLContext =
        DefaultDSLContext(connectionProvider, SQLDialect.POSTGRES)
}
