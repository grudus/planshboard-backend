package com.grudus.planshboard.auth.registration

import com.grudus.planshboard.auth.UserAuthenticationService
import com.grudus.planshboard.commons.validation.ValidationKeys
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.ArgumentMatchers.anyString
import org.mockito.Mock
import org.mockito.Mockito
import org.mockito.junit.jupiter.MockitoExtension
import com.grudus.planshboard.utils.randomText
import org.junit.jupiter.api.Assertions.*

@ExtendWith(MockitoExtension::class)
class RegisterUserValidatorTest {
    @Mock
    private lateinit var userAuthenticationService: UserAuthenticationService

    private lateinit var registerUserValidator: RegisterUserValidator

    @BeforeEach
    fun init() {
        Mockito.`when`(userAuthenticationService.exists(anyString())).thenReturn(false)
        registerUserValidator = RegisterUserValidator(userAuthenticationService)
    }

    @AfterEach
    fun cleanUp() {
        Mockito.reset(userAuthenticationService)
    }

    @Test
    fun `should validate properly`() {
        val password = randomText()
        val username = randomText()

        val request = RegisterUserRequest(username, password, password)

        val validationResult = registerUserValidator.validate(request)

        assertTrue(validationResult.isSuccess())
    }

    @Test
    fun `should not validate properly when empty fields`() {
        val password = randomText()
        val username = "   \t"

        val request = RegisterUserRequest(username, password, password)

        val validationResult = registerUserValidator.validate(request)

        assertFalse(validationResult.isSuccess())
        assertEquals(ValidationKeys.EMPTY_FIELD, validationResult.getError())
    }

    @Test
    fun `should not validate properly when password not match`() {
        val password = randomText()
        val username = randomText()

        val request = RegisterUserRequest(username, password, randomText())

        val validationResult = registerUserValidator.validate(request)

        assertFalse(validationResult.isSuccess())
        assertEquals(ValidationKeys.PASSWORD_MISMATCH, validationResult.getError())
    }

    @Test
    fun `should not validate properly when user exists`() {
        Mockito.`when`(userAuthenticationService.exists(anyString())).thenReturn(true)

        val password = randomText()
        val username = randomText()

        val request = RegisterUserRequest(username, password, randomText())

        val validationResult = registerUserValidator.validate(request)

        assertFalse(validationResult.isSuccess())
        assertEquals(ValidationKeys.PASSWORD_MISMATCH, validationResult.getError())
    }
}
