package com.grudus.planshboard.opponents.validators

import com.grudus.planshboard.commons.validation.ValidationKeys
import com.grudus.planshboard.opponents.OpponentService
import com.grudus.planshboard.opponents.model.CreateOpponentRequest
import com.grudus.planshboard.user.UserService
import com.grudus.planshboard.utils.randomText
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.ArgumentMatchers.anyString
import org.mockito.Mock
import org.mockito.Mockito
import org.mockito.junit.jupiter.MockitoExtension

@ExtendWith(MockitoExtension::class)
class CreateOpponentRequestValidatorTest {
    @Mock
    private lateinit var userService: UserService
    @Mock
    private lateinit var opponentService: OpponentService

    private lateinit var validator: CreateOpponentRequestValidator

    @BeforeEach
    fun init() {
        validator = CreateOpponentRequestValidator(opponentService, userService)
    }

    @Test
    fun `should validate properly`() {
        val request = CreateOpponentRequest(randomText())

        val validationResult = validator.performValidation(request)

        assertTrue(validationResult.isSuccess())
    }

    @Test
    fun `should not pass validation with empty opponent name`() {
        val request = CreateOpponentRequest("")

        val validationResult = validator.performValidation(request)

        assertFalse(validationResult.isSuccess())
        assertEquals(ValidationKeys.EMPTY_FIELD, validationResult.getError())
    }

    @Test
    fun `should not pass validation when opponent already exists`() {
        Mockito.`when`(opponentService.existsForCurrentUser(anyString())).thenReturn(true)
        val request = CreateOpponentRequest(randomText())

        val validationResult = validator.performValidation(request)

        assertFalse(validationResult.isSuccess())
        assertEquals(ValidationKeys.OPPONENT_ALREADY_EXISTS, validationResult.getError())
    }

    @Test
    fun `should not pass validation when existing user does not exist`() {
        Mockito.`when`(userService.findIdByName(anyString())).thenReturn(null)
        val request = CreateOpponentRequest(randomText(), randomText())

        val validationResult = validator.performValidation(request)

        assertFalse(validationResult.isSuccess())
        assertEquals(ValidationKeys.UNKNOWN_USER, validationResult.getError())
    }

    @Test
    fun `should not pass validation when linking with already linked user`() {
        Mockito.`when`(opponentService.userAlreadyLinked(anyString())).thenReturn(true)
        val request = CreateOpponentRequest(randomText(), randomText())

        val validationResult = validator.performValidation(request)

        assertFalse(validationResult.isSuccess())
        assertEquals(ValidationKeys.USER_ALREADY_LINKED, validationResult.getError())
    }
}
