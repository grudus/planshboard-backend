package com.grudus.planshboard.boardgames

import com.grudus.planshboard.boardgames.model.BoardGame
import com.grudus.planshboard.boardgames.options.BoardGameOptionsDao
import com.grudus.planshboard.utils.randomText
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.ArgumentMatchers.anyLong
import org.mockito.Mock
import org.mockito.Mockito
import org.mockito.junit.jupiter.MockitoExtension
import java.time.LocalDateTime.now
import kotlin.random.Random.Default.nextLong

@ExtendWith(MockitoExtension::class)
class BoardGameServiceTest {

    @Mock
    private lateinit var boardGameDao: BoardGameDao

    @Mock
    private lateinit var boardGameOptionsDao: BoardGameOptionsDao

    private lateinit var boardGameService: BoardGameService

    @BeforeEach
    fun init() {
        boardGameService = BoardGameService(boardGameDao, boardGameOptionsDao)
    }

    @Test
    fun `should return linked and owned board games`() {
        val userBoardGames = listOf(randomBoardGame(), randomBoardGame())

        Mockito.`when`(boardGameDao.findBoardGamesCreatedByUser(anyLong())).thenReturn(userBoardGames)

        val boardGames = boardGameService.findBoardGamesForUser(nextLong())

        assertEquals(userBoardGames, boardGames)
    }

    private fun randomBoardGame() = BoardGame(null, randomText(), nextLong(), now())
}
