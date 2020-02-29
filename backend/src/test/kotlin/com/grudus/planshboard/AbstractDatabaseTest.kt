package com.grudus.planshboard

import com.grudus.planshboard.auth.UserAuthenticationService
import com.grudus.planshboard.auth.registration.RegisterUserRequest
import com.grudus.planshboard.commons.Id
import com.grudus.planshboard.utils.randomText
import org.jooq.DSLContext
import org.springframework.beans.factory.annotation.Autowired

abstract class AbstractDatabaseTest : SpringBasedTest() {

    @Autowired
    protected lateinit var dsl: DSLContext

    @Autowired
    private lateinit var userService: UserAuthenticationService

    protected val firstUserId by lazy { addUser() }

    protected fun addUser(): Id =
        userService.register(RegisterUserRequest(randomText(), randomText(), randomText()))
}
