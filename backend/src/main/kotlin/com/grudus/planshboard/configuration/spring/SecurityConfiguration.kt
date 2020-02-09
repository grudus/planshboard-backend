package com.grudus.planshboard.configuration.spring

import com.grudus.planshboard.configuration.filters.CorsFilter
import com.grudus.planshboard.configuration.filters.StatelessAuthenticationFilter
import com.grudus.planshboard.configuration.filters.StatelessLoginFilter
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter
import org.springframework.security.config.http.SessionCreationPolicy.STATELESS
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter


@Configuration
@EnableWebSecurity
class StatelessSecurityConfiguration
@Autowired
constructor(private val corsFilter: CorsFilter,
            private val statelessLoginFilter: StatelessLoginFilter,
            private val statelessAuthenticationFilter: StatelessAuthenticationFilter) : WebSecurityConfigurerAdapter() {

    override fun configure(http: HttpSecurity) {
        http
            .csrf().disable()
            .sessionManagement().sessionCreationPolicy(STATELESS)
            .and()
            .authorizeRequests()
            .antMatchers("/api/auth/**").permitAll()
            .anyRequest().authenticated()
            .and()
            .addFilterBefore(corsFilter, UsernamePasswordAuthenticationFilter::class.java)
            .addFilterBefore(statelessLoginFilter, UsernamePasswordAuthenticationFilter::class.java)
            .addFilterBefore(statelessAuthenticationFilter, UsernamePasswordAuthenticationFilter::class.java)
    }
}
