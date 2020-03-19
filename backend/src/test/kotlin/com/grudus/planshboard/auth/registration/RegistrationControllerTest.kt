package com.grudus.planshboard.auth.registration

import com.grudus.planshboard.AbstractControllerTest
import com.grudus.planshboard.auth.UserAuthenticationService
import com.grudus.planshboard.commons.validation.ValidationKeys
import com.grudus.planshboard.utils.randomText
import org.hamcrest.Matchers
import org.hamcrest.Matchers.`is`
import org.hamcrest.Matchers.notNullValue
import org.junit.jupiter.api.Assertions.assertFalse
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

class RegistrationControllerTest
@Autowired
constructor(private val userAuthenticationService: UserAuthenticationService) : AbstractControllerTest() {


    @Test
    fun `should register user properly and return id`() {
        val password = randomText()
        val registerUserRequest = RegisterUserRequest(randomText(), password, password)
        postRequest("/api/auth/registration", registerUserRequest)
            .andExpect(status().isCreated)
            .andExpect(jsonPath("$.id", notNullValue()))
    }

    @Test
    fun `should detect if registered user exists`() {
        val username = randomText()
        val password = randomText()
        val registerUserRequest = RegisterUserRequest(username, password, password)

        postRequest("/api/auth/registration", registerUserRequest)
            .andExpect(status().isCreated)

        assertTrue(userAuthenticationService.exists(username))
    }

    @Test
    fun `should perform validation`() {
        val registerUserRequest = RegisterUserRequest(randomText(), randomText(), randomText())

        postRequest("/api/auth/registration", registerUserRequest)
            .andExpect(status().isBadRequest)
            .andExpect(jsonPath("$.code", `is`(ValidationKeys.PASSWORD_MISMATCH)))
            .andExpect(jsonPath("$.message", notNullValue()))
    }

    @Test
    fun `should not find user when invalid registration`() {
        val username = randomText()
        val registerUserRequest = RegisterUserRequest(username, randomText(), randomText())

        postRequest("/api/auth/registration", registerUserRequest)
            .andExpect(status().isBadRequest)

        assertFalse(userAuthenticationService.exists(username))
    }

    @Test
    fun `should check if username exists`() {
        val username = randomText()
        registerUser(username)

        getRequest("/api/auth/registration/exists?username={username}", username)
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.exists").value(true))
    }

    @Test
    fun `should detect that username does not exist`() {
        registerUser()
        registerUser()

        getRequest("/api/auth/registration/exists?username={username}", randomText())
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.exists").value(false))
    }

    private fun registerUser(username: String = randomText()) {
        val password = randomText()
        val registerUserRequest = RegisterUserRequest(username, password, password)

        postRequest("/api/auth/registration", registerUserRequest)
            .andExpect(status().isCreated)
    }

}
