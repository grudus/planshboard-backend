package com.grudus.planshboard.auth.registration

import com.grudus.planshboard.auth.UserAuthenticationService
import com.grudus.planshboard.commons.validation.*
import org.apache.commons.lang3.StringUtils.isAnyBlank
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

@Component
class RegisterUserValidator
@Autowired
constructor(private val authenticationService: UserAuthenticationService) {

    fun validate(request: RegisterUserRequest): ValidationResult =
        when {
            requiredFieldsAreEmpty(request) -> ValidationError(ValidationKeys.EMPTY_FIELD)
            passwordsAreNotEqual(request) -> ValidationError(ValidationKeys.PASSWORD_MISMATCH)
            userAlreadyExists(request) -> ValidationError(ValidationKeys.USER_ALREADY_EXISTS)
            else -> ValidationSuccess
        }

    private fun passwordsAreNotEqual(request: RegisterUserRequest) =
        request.password != request.confirmPassword


    private fun requiredFieldsAreEmpty(request: RegisterUserRequest) =
        isAnyBlank(request.username, request.password, request.confirmPassword)

    private fun userAlreadyExists(request: RegisterUserRequest) =
        authenticationService.exists(request.username)


}
