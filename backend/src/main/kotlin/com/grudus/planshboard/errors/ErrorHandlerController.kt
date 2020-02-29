package com.grudus.planshboard.errors

import com.grudus.planshboard.commons.exceptions.UserHasNoAccessToResourceException
import com.grudus.planshboard.commons.validation.InvalidRequestException
import com.grudus.planshboard.commons.validation.ValidationKeys
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.ResponseBody
import org.springframework.web.bind.annotation.ResponseStatus

@ControllerAdvice
@ResponseBody
class ErrorHandlerController {
    private val log = LoggerFactory.getLogger(javaClass)

    @ExceptionHandler(InvalidRequestException::class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    fun noSuchElementException(e: InvalidRequestException): ErrorResponse {
        log.warn(e.message)
        return ErrorResponse("Invalid request", e.error)
    }

    @ExceptionHandler(UserHasNoAccessToResourceException::class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    fun userHasNoAccess(e: UserHasNoAccessToResourceException): ErrorResponse {
        log.warn(e.message)
        return ErrorResponse("User has no access to the resource", ValidationKeys.FORBIDDEN)
    }

}
