package com.grudus.planshboard.opponents

import com.grudus.planshboard.AbstractDatabaseTest
import com.grudus.planshboard.boardgames.BoardGameService
import com.grudus.planshboard.boardgames.model.CreateBoardGameRequest
import com.grudus.planshboard.commons.Id
import com.grudus.planshboard.plays.PlayService
import com.grudus.planshboard.plays.model.PlayResult
import com.grudus.planshboard.plays.model.SavePlayRequest
import com.grudus.planshboard.utils.randomText
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import java.lang.Thread.sleep

class OpponentStatsDaoTest : AbstractDatabaseTest() {
    @Autowired
    private lateinit var opponentDao: OpponentDao

    @Autowired
    private lateinit var opponentStatsDao: OpponentStatsDao

    @Autowired
    private lateinit var playService: PlayService

    @Autowired
    private lateinit var boardGameService: BoardGameService

    private /* cannot lateinit primitives */ var user: Id = 1
    private /* cannot lateinit primitives */ var boardGame: Id = 1

    @BeforeEach
    fun init() {
        user = addUser()
        boardGame = boardGameService.createBoardGame(user, CreateBoardGameRequest(randomText()))
    }


    @Test
    fun `should sort most frequent opponents by number of plays`() {
        val opponent1 = opponentDao.createNew(randomText(), user)
        val opponent2 = opponentDao.createNew(randomText(), user)
        val opponent3 = opponentDao.createNew(randomText(), user)

        addPlay(listOf(opponent1, opponent3))
        addPlay(listOf(opponent1, opponent2, opponent3))
        addPlay(listOf(opponent1, opponent2, opponent3))
        addPlay(listOf(opponent3))

        val opponents = opponentStatsDao.findMostFrequentOpponents(user, 5)

        assertEquals(opponent3, opponents[0].id)
        assertEquals(opponent1, opponents[1].id)
        assertEquals(opponent2, opponents[2].id)
    }

    @Test
    fun `should sort most frequent opponents by creation date if both have the same number of plays`() {
        val opponent1 = opponentDao.createNew(randomText(), user)
        sleep(50)
        val opponent2 = opponentDao.createNew(randomText(), user)
        sleep(50)
        val opponent3 = opponentDao.createNew(randomText(), user)

        addPlay(listOf(opponent1, opponent2))
        addPlay(listOf(opponent1, opponent2, opponent3))

        val opponents = opponentStatsDao.findMostFrequentOpponents(user, 5)

        assertEquals(opponent2, opponents[0].id)
        assertEquals(opponent1, opponents[1].id)
        assertEquals(opponent3, opponents[2].id)
    }

    @Test
    fun `should return empty frequent opponent list when no opponents`() {
        val anotherUserOpponent = opponentDao.createNew(randomText(), addUser())

        addPlay(listOf(anotherUserOpponent))

        val opponents = opponentStatsDao.findMostFrequentOpponents(user, 5)

        assertTrue(opponents.isEmpty())
    }

    @Test
    fun `should find frequent opponents without any play`() {
        opponentDao.createNew(randomText(), user)
        opponentDao.createNew(randomText(), user)
        opponentDao.createNew(randomText(), user)

        val opponents = opponentStatsDao.findMostFrequentOpponents(user, 5)

        assertEquals(3, opponents.size)
    }

    @Test
    fun `should limit frequent opponents`() {
        val opponent1 = opponentDao.createNew(randomText(), user)
        val opponent2 = opponentDao.createNew(randomText(), user)

        addPlay(listOf(opponent1, opponent2))
        addPlay(listOf(opponent2))

        val opponents = opponentStatsDao.findMostFrequentOpponents(user, 1)

        assertEquals(1, opponents.size)
        assertEquals(opponent2, opponents[0].id)
    }


    @Test
    fun `should find opponents with most recent plays`() {
        val opponent1 = opponentDao.createNew(randomText(), user)
        val opponent2 = opponentDao.createNew(randomText(), user)
        val opponent3 = opponentDao.createNew(randomText(), user)
        val opponent4 = opponentDao.createNew(randomText(), user)

        addPlay(listOf(opponent1, opponent2))
        addPlay(listOf(opponent1, opponent2))
        addPlay(listOf(opponent1, opponent2))
        addPlay(listOf(opponent3))
        addPlay(listOf(opponent1))
        addPlay(listOf(opponent4))

        val opponents = opponentStatsDao.findOpponentsWithMostRecentPlays(user, 10)

        assertEquals(4, opponents.size)
        assertEquals(opponent4, opponents[0].id)
        assertEquals(opponent1, opponents[1].id)
        assertEquals(opponent3, opponents[2].id)
        assertEquals(opponent2, opponents[3].id)
    }


    @Test
    fun `should sort opponents with most recent plays by play date with newest opponents first`() {
        val opponent1 = opponentDao.createNew(randomText(), user)
        sleep(50)
        val opponent2 = opponentDao.createNew(randomText(), user)
        sleep(50)
        val opponent3 = opponentDao.createNew(randomText(), user)
        sleep(50)
        val opponent4 = opponentDao.createNew(randomText(), user)

        addPlay(listOf(opponent1, opponent2))
        sleep(50)
        addPlay(listOf(opponent1, opponent3))
        sleep(50)
        addPlay(listOf(opponent1, opponent2))
        sleep(50)
        addPlay(listOf(opponent4, opponent1))

        val opponents = opponentStatsDao.findOpponentsWithMostRecentPlays(user, 10)

        assertEquals(4, opponents.size)
        assertEquals(opponent4, opponents[0].id)
        assertEquals(opponent1, opponents[1].id)
        assertEquals(opponent2, opponents[2].id)
        assertEquals(opponent3, opponents[3].id)
    }


    @Test
    fun `should limit opponents with most recent plays`() {
        val opponent1 = opponentDao.createNew(randomText(), user)
        val opponent2 = opponentDao.createNew(randomText(), user)

        addPlay(listOf(opponent1, opponent2))
        addPlay(listOf(opponent1))

        val opponents = opponentStatsDao.findOpponentsWithMostRecentPlays(user, 1)

        assertEquals(1, opponents.size)
        assertEquals(opponent1, opponents[0].id)
    }


    @Test
    fun `should not return opponents without plays when finding opponents with most recent plays`() {
        val opponent1 = opponentDao.createNew(randomText(), user)
        opponentDao.createNew(randomText(), user)
        opponentDao.createNew(randomText(), user)

        addPlay(listOf(opponent1))

        val opponents = opponentStatsDao.findOpponentsWithMostRecentPlays(user, 10)

        assertEquals(1, opponents.size)
        assertEquals(opponent1, opponents[0].id)
    }


    private fun addPlay(opponents: List<Id>) {
        playService.createPlay(SavePlayRequest(
            boardGame,
            opponents.map { PlayResult(it) },
            listOf()
        ))

    }
}
