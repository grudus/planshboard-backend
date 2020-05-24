package com.grudus.planshboard.plays

import com.grudus.planshboard.AbstractDatabaseTest
import com.grudus.planshboard.boardgames.BoardGameDao
import com.grudus.planshboard.opponents.OpponentDao
import com.grudus.planshboard.plays.model.CreatePlayRequest
import com.grudus.planshboard.plays.model.PlayResult
import com.grudus.planshboard.tables.PlayResults.PLAY_RESULTS
import com.grudus.planshboard.tables.Plays.PLAYS
import com.grudus.planshboard.utils.randomText
import org.jooq.DSLContext
import org.jooq.exception.DataAccessException
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.springframework.beans.factory.annotation.Autowired
import java.time.LocalDateTime

class PlayDaoTest
@Autowired
constructor(private val playDao: PlayDao,
            private val boardGameDao: BoardGameDao,
            private val opponentDao: OpponentDao,
            private val dslContext: DSLContext) : AbstractDatabaseTest() {

    @Test
    fun `should save play`() {
        val boardGameId = boardGameDao.create(addUser(), randomText())
        val id = playDao.savePlayAlone(CreatePlayRequest(boardGameId, emptyList(), emptyList(), LocalDateTime.now(), randomText()))

        assertNotNull(id)
        assertEquals(1, dslContext.fetchCount(PLAYS))
    }

    @Test
    fun `should not be able to save play with non existing board game`() {
        assertThrows<DataAccessException> {
            playDao.savePlayAlone(CreatePlayRequest(1, emptyList(), emptyList(), LocalDateTime.now(), randomText()))
        }
    }

    @Test
    fun `should save play results`() {
        val creatorId = addUser()
        val boardGameId = boardGameDao.create(creatorId, randomText())
        val playId = playDao.savePlayAlone(CreatePlayRequest(boardGameId, emptyList(), emptyList(), LocalDateTime.now(), randomText()))
        val opponentId = opponentDao.createNew(randomText(), creatorId)

        playDao.savePlayResults(playId, listOf(PlayResult(opponentId, 12, 12)))

        assertEquals(1, dsl.fetchCount(PLAY_RESULTS))
    }

    @Test
    fun `should not be able to save results with non existing play`() {
        val creatorId = addUser()
        val opponentId = opponentDao.createNew(randomText(), creatorId)

        assertThrows<DataAccessException> {
            playDao.savePlayResults(1L, listOf(PlayResult(opponentId, 12, 12)))
        }
    }

    @Test
    fun `should not be able to save results with non existing opponent`() {
        val creatorId = addUser()
        val boardGameId = boardGameDao.create(creatorId, randomText())
        val playId = playDao.savePlayAlone(CreatePlayRequest(boardGameId, emptyList(), emptyList(), LocalDateTime.now(), randomText()))


        assertThrows<DataAccessException> {
            playDao.savePlayResults(playId, listOf(PlayResult(1L)))
        }
    }


}
