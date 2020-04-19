package com.grudus.planshboard.commons.validation

import com.grudus.planshboard.commons.ErrorKey

sealed class ValidationResult {
    abstract fun getError(): ErrorKey?

    fun isSuccess(): Boolean = getError() == null

    fun throwOnError() {
        if (!isSuccess())
            throw InvalidRequestException(getError()!!)
    }
}

object ValidationSuccess : ValidationResult() {
    override fun getError(): ErrorKey? = null
}

class ValidationError(private val errorKey: ErrorKey) : ValidationResult() {
    override fun getError(): ErrorKey = errorKey
}
