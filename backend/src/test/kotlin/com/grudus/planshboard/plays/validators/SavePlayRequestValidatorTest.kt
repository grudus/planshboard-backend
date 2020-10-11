package com.grudus.planshboard.plays.validators

import com.grudus.planshboard.boardgames.BoardGameSecurityService
import com.grudus.planshboard.commons.exceptions.UserHasNoAccessToResourceException
import com.grudus.planshboard.commons.validation.ValidationKeys
import com.grudus.planshboard.opponents.OpponentSecurityService
import com.grudus.planshboard.plays.model.FinalResult
import com.grudus.planshboard.plays.model.PlayResult
import com.grudus.planshboard.plays.model.SavePlayRequest
import com.grudus.planshboard.utils.TestUtils.eq
import com.grudus.planshboard.utils.randomText
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mock
import org.mockito.Mockito
import org.mockito.junit.jupiter.MockitoExtension
import java.time.LocalDateTime.now
import kotlin.random.Random.Default.nextLong

@ExtendWith(MockitoExtension::class)
class SavePlayRequestValidatorTest {

    @Mock
    private lateinit var boardGameSecurityService: BoardGameSecurityService

    @Mock
    private lateinit var opponentSecurityService: OpponentSecurityService

    private lateinit var validator: SavePlayRequestValidator

    @BeforeEach
    fun init() {
        validator = SavePlayRequestValidator(boardGameSecurityService, opponentSecurityService)
    }

    @Test
    fun `should validate properly`() {
        val request = SavePlayRequest(nextLong(), listOf(PlayResult(nextLong())), listOf(randomText()), now().minusDays(1), randomText())

        val result = validator.validate(request)
        assertTrue(result.isSuccess())
    }

    @Test
    fun `should validate properly when no tags`() {
        val request = SavePlayRequest(nextLong(), listOf(PlayResult(nextLong())), listOf(), now().minusDays(1), randomText())

        val result = validator.validate(request)
        assertTrue(result.isSuccess())
    }

    @Test
    fun `should validate properly when no date`() {
        val request = SavePlayRequest(nextLong(), listOf(PlayResult(nextLong())), listOf(randomText()), null, randomText())

        val result = validator.validate(request)
        assertTrue(result.isSuccess())
    }

    @Test
    fun `should validate properly when no note`() {
        val request = SavePlayRequest(nextLong(), listOf(PlayResult(nextLong())), listOf(randomText()))

        val result = validator.validate(request)
        assertTrue(result.isSuccess())
    }

    @Test
    fun `should validate properly when date is in the future`() {
        val request = SavePlayRequest(nextLong(), listOf(PlayResult(nextLong())), listOf(randomText()), now().plusYears(12))

        val result = validator.validate(request)
        assertTrue(result.isSuccess())
    }

    @Test
    fun `should not pass validation when no results`() {
        val request = SavePlayRequest(nextLong(), listOf(), listOf(randomText()))

        val result = validator.validate(request)
        assertFalse(result.isSuccess())
        assertEquals(ValidationKeys.EMPTY_FIELD, result.getError())
    }

    @Test
    fun `should not pass validation when result's position is greater than number of results`() {
        val request = SavePlayRequest(nextLong(), listOf(PlayResult(nextLong(), position = 3), PlayResult(nextLong())), listOf(randomText()))

        val result = validator.validate(request)
        assertFalse(result.isSuccess())
        assertEquals(ValidationKeys.INVALID_POSITION, result.getError())
    }

    @Test
    fun `should not pass validation when result's position is below zero`() {
        val request = SavePlayRequest(nextLong(), listOf(PlayResult(nextLong(), position = -1), PlayResult(nextLong())), listOf(randomText()))

        val result = validator.validate(request)
        assertFalse(result.isSuccess())
        assertEquals(ValidationKeys.INVALID_POSITION, result.getError())
    }

    @Test
    fun `should not pass validation when board game does not exist`() {
        val request = SavePlayRequest(nextLong(), listOf(PlayResult(nextLong())), listOf())
        Mockito.doThrow(UserHasNoAccessToResourceException::class.java).`when`(boardGameSecurityService).checkAccess(eq(request.boardGameId))

        val result = validator.validate(request)
        assertFalse(result.isSuccess())
        assertEquals(ValidationKeys.INVALID_BOARD_GAME, result.getError())
    }

    @Test
    fun `should not pass validation when opponent does not exist`() {
        val request = SavePlayRequest(nextLong(), listOf(PlayResult(nextLong())), listOf())
        Mockito.doThrow(UserHasNoAccessToResourceException::class.java).`when`(opponentSecurityService).checkAccessForMultipleOpponents(eq(request.results.map { it.opponentId }))

        val result = validator.validate(request)
        assertFalse(result.isSuccess())
        assertEquals(ValidationKeys.INVALID_OPPONENT, result.getError())
    }
}
