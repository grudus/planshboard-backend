package com.grudus.planshboard.opponents.validators

import com.grudus.planshboard.commons.validation.ValidationKeys
import com.grudus.planshboard.opponents.OpponentService
import com.grudus.planshboard.opponents.model.LinkedOpponentStatus
import com.grudus.planshboard.opponents.model.LinkedOpponentStatus.WAITING_FOR_CONFIRMATION
import com.grudus.planshboard.opponents.model.OpponentDto
import com.grudus.planshboard.opponents.model.SaveOpponentRequest
import com.grudus.planshboard.opponents.model.UserLinkedToOpponent
import com.grudus.planshboard.user.UserService
import com.grudus.planshboard.utils.TestUtils.eq
import com.grudus.planshboard.utils.randomText
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.ArgumentMatchers.anyLong
import org.mockito.ArgumentMatchers.anyString
import org.mockito.Mock
import org.mockito.Mockito
import org.mockito.junit.jupiter.MockitoExtension
import kotlin.random.Random.Default.nextLong

@ExtendWith(MockitoExtension::class)
class SaveOpponentRequestValidatorTest {
    @Mock
    private lateinit var userService: UserService
    @Mock
    private lateinit var opponentService: OpponentService

    private lateinit var validatorSave: SaveOpponentRequestValidator

    @BeforeEach
    fun init() {
        validatorSave = SaveOpponentRequestValidator(opponentService, userService)
    }

    @Test
    fun `should validate properly`() {
        val request = SaveOpponentRequest(randomText())

        val validationResult = validatorSave.validate(request)

        assertTrue(validationResult.isSuccess())
    }

    @Test
    fun `should not pass validation with empty opponent name`() {
        val request = SaveOpponentRequest("")

        val validationResult = validatorSave.validate(request)

        assertFalse(validationResult.isSuccess())
        assertEquals(ValidationKeys.EMPTY_FIELD, validationResult.getError())
    }

    @Test
    fun `should not pass validation when opponent already exists`() {
        Mockito.`when`(opponentService.existsForCurrentUser(anyString())).thenReturn(true)
        val request = SaveOpponentRequest(randomText())

        val validationResult = validatorSave.validate(request)

        assertFalse(validationResult.isSuccess())
        assertEquals(ValidationKeys.OPPONENT_ALREADY_EXISTS, validationResult.getError())
    }

    @Test
    fun `should not pass validation when existing user does not exist`() {
        Mockito.`when`(userService.findIdByName(anyString())).thenReturn(null)
        val request = SaveOpponentRequest(randomText(), randomText())

        val validationResult = validatorSave.validate(request)

        assertFalse(validationResult.isSuccess())
        assertEquals(ValidationKeys.UNKNOWN_USER, validationResult.getError())
    }

    @Test
    fun `should not pass validation when linking with already linked user`() {
        Mockito.`when`(opponentService.userAlreadyLinked(anyString())).thenReturn(true)
        val request = SaveOpponentRequest(randomText(), randomText())

        val validationResult = validatorSave.validate(request)

        assertFalse(validationResult.isSuccess())
        assertEquals(ValidationKeys.USER_ALREADY_LINKED, validationResult.getError())
    }

    @Test
    fun `should allow the same name if updating existing opponent`() {
        val opponentName = randomText()
        Mockito.lenient().`when`(opponentService.existsForCurrentUser(anyString())).thenReturn(true)
        Mockito.`when`(opponentService.findById(anyLong())).thenReturn(OpponentDto(1, opponentName))
        val request = SaveOpponentRequest(opponentName, randomText())

        val validationResult = validatorSave.validate(request, nextLong())

        assertTrue(validationResult.isSuccess())
    }

    @Test
    fun `should allow the same linked user if updating existing opponent`() {
        val userName = randomText()
        Mockito.lenient().`when`(opponentService.userAlreadyLinked(anyString())).thenReturn(true)
        Mockito.`when`(opponentService.findById(anyLong())).thenReturn(OpponentDto(1, randomText(), UserLinkedToOpponent(1, userName, WAITING_FOR_CONFIRMATION)))
        val request = SaveOpponentRequest(randomText(), userName)

        val validationResult = validatorSave.validate(request, nextLong())

        assertTrue(validationResult.isSuccess())
    }
}
