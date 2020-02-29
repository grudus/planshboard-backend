package com.grudus.planshboard.boardgames

import com.grudus.planshboard.boardgames.model.CreateBoardGameRequest
import com.grudus.planshboard.commons.validation.ValidationKeys
import com.grudus.planshboard.user.CurrentUserService
import com.grudus.planshboard.utils.randomText
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.ArgumentMatchers.anyLong
import org.mockito.ArgumentMatchers.anyString
import org.mockito.Mock
import org.mockito.Mockito.`when`
import org.mockito.junit.jupiter.MockitoExtension

@ExtendWith(MockitoExtension::class)
class CreateBoardGameValidatorTest {
    @Mock
    private lateinit var boardGameService: BoardGameService

    @Mock
    private lateinit var currentUserService: CurrentUserService

    private lateinit var validator: CreateBoardGameValidator

    @BeforeEach
    fun init() {
        validator = CreateBoardGameValidator(boardGameService, currentUserService)
    }

    @Test
    fun `should validate properly`() {
        `when`(boardGameService.nameExists(anyLong(), anyString())).thenReturn(false)
        val request = CreateBoardGameRequest(randomText())

        val validationResult = validator.performValidation(request)

        assertTrue(validationResult.isSuccess())
    }

    @Test
    fun `should not validate properly when empty name`() {
        val request = CreateBoardGameRequest("\t ")

        val validationResult = validator.performValidation(request)

        assertFalse(validationResult.isSuccess())
        assertEquals(ValidationKeys.EMPTY_FIELD, validationResult.getError())
    }

    @Test
    fun `should not validate properly when name exists`() {
        `when`(boardGameService.nameExists(anyLong(), anyString())).thenReturn(true)
        val request = CreateBoardGameRequest(randomText())

        val validationResult = validator.performValidation(request)

        assertFalse(validationResult.isSuccess())
        assertEquals(ValidationKeys.GAME_ALREADY_EXISTS, validationResult.getError())
    }

}
