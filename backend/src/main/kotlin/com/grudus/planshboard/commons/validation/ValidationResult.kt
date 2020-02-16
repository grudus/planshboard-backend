package com.grudus.planshboard.commons.validation

import com.grudus.planshboard.commons.ErrorKey

sealed class ValidationResult {
    abstract fun isSuccess(): Boolean
    abstract fun getError(): ErrorKey?
}

object ValidationSuccess : ValidationResult() {
    override fun isSuccess() = true
    override fun getError(): ErrorKey? = null
}

class ValidationError(private val errorKey: ErrorKey) : ValidationResult() {
    override fun isSuccess() = false
    override fun getError(): ErrorKey = errorKey
}
