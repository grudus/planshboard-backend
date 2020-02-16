package com.grudus.planshboard.commons.validation

abstract class RequestValidator<REQ_BODY> {

    @Throws(InvalidRequestException::class)
    fun validate(request: REQ_BODY) {
        val validationResult = performValidation(request)

        if (!validationResult.isSuccess())
            throw InvalidRequestException(validationResult.getError()!!)
    }

    abstract fun performValidation(request: REQ_BODY): ValidationResult
}
