package com.grudus.planshboard.commons.security

import com.grudus.planshboard.commons.exceptions.UserHasNoAccessToResourceException

sealed class SecurityCheckResult {
    abstract fun hasAccess(): Boolean
    open fun errorMessage(): String = "Security check failed"

    fun throwWhenAccessForbidden() {
        if (!hasAccess()) {
            throw UserHasNoAccessToResourceException(errorMessage())
        }
    }
}

object AccessAllowed : SecurityCheckResult() {
    override fun hasAccess() = true
}

class AccessForbidden(private val errorMessage: String) : SecurityCheckResult() {
    override fun hasAccess() = false
    override fun errorMessage() = errorMessage
}
