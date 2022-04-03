package com.grudus.planshboard.boardgames.validators

import com.grudus.planshboard.boardgames.BoardGameService
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
class BoardGameNameValidatorTest {
    @Mock
    private lateinit var boardGameService: BoardGameService

    @Mock
    private lateinit var currentUserService: CurrentUserService

    private lateinit var nameValidator: BoardGameNameValidator

    @BeforeEach
    fun init() {
        nameValidator = BoardGameNameValidator(boardGameService, currentUserService)
    }

    @Test
    fun `should validate properly`() {
        `when`(boardGameService.nameExists(anyLong(), anyString())).thenReturn(false)
        val name = randomText()

        val validationResult = nameValidator.validate(name)

        assertTrue(validationResult.isSuccess())
    }

    @Test
    fun `should not validate properly when empty name`() {
        val name = "\t "

        val validationResult = nameValidator.validate(name)

        assertFalse(validationResult.isSuccess())
        assertEquals(ValidationKeys.EMPTY_FIELD, validationResult.getError())
    }

    @Test
    fun `should not validate properly when name exists`() {
        `when`(boardGameService.nameExists(anyLong(), anyString())).thenReturn(true)
        val name = randomText()

        val validationResult = nameValidator.validate(name)

        assertFalse(validationResult.isSuccess())
        assertEquals(ValidationKeys.GAME_ALREADY_EXISTS, validationResult.getError())
    }

}
