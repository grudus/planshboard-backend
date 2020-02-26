package com.grudus.planshboard.auth.registration

import com.grudus.planshboard.auth.UserAuthenticationService
import com.grudus.planshboard.commons.responses.IdResponse
import com.grudus.planshboard.commons.responses.idOf
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/auth/registration")
class RegistrationController
@Autowired
constructor(private val userAuthenticationService: UserAuthenticationService,
            private val registerUserValidator: RegisterUserValidator) {

    private val log = LoggerFactory.getLogger(javaClass.simpleName)

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun registerUser(@RequestBody registerUserRequest: RegisterUserRequest): IdResponse {
        registerUserValidator.validate(registerUserRequest)

        log.info("Registering user (${registerUserRequest.username})")
        return idOf(userAuthenticationService.register(registerUserRequest))
    }
}
