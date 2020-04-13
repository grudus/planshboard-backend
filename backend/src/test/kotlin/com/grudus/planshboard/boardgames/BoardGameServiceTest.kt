package com.grudus.planshboard.boardgames

import com.grudus.planshboard.boardgames.model.BoardGame
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

    private lateinit var boardGameService: BoardGameService

    @BeforeEach
    fun init() {
        boardGameService = BoardGameService(boardGameDao)
    }

    @Test
    fun `should return linked and owned board games`() {
        val userBoardGames = listOf(randomBoardGame(), randomBoardGame())
        val linkedBoardGames = listOf(randomBoardGame())
        val allBoardGames = (userBoardGames + linkedBoardGames).sortedBy { it.name }

        Mockito.`when`(boardGameDao.findBoardGamesCreatedByUser(anyLong())).thenReturn(userBoardGames)
        Mockito.`when`(boardGameDao.findBoardGamesLinkedFroUser(anyLong())).thenReturn(linkedBoardGames)

        val boardGames = boardGameService.findBoardGamesForUser(nextLong())

        assertEquals(allBoardGames, boardGames)
    }

    private fun randomBoardGame() = BoardGame(null, randomText(), nextLong(), now())
}
