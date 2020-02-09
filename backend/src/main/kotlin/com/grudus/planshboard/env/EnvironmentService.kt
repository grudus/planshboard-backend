package com.grudus.planshboard.env

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.core.env.Environment
import org.springframework.stereotype.Service

@Service
class EnvironmentService
@Autowired
constructor(private val environment: Environment) {

    fun getTextSafe(key: String): String? =
        environment.getProperty(key)

    fun getText(key: String): String =
        environment.getProperty(key) ?: throw CannotFindKeyException(key)

    fun getList(key: String): List<String> =
        getTextSafe(key)?.split(",") ?: emptyList()

    fun getLong(key: String): Long =
        environment.getProperty(key, Long::class.java) ?: throw CannotFindKeyException(key)
}
