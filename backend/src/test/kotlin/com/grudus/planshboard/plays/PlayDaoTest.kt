package com.grudus.planshboard.plays

import com.grudus.planshboard.AbstractDatabaseTest
import com.grudus.planshboard.boardgames.BoardGameDao
import com.grudus.planshboard.opponents.OpponentDao
import com.grudus.planshboard.plays.model.PlayResult
import com.grudus.planshboard.plays.model.SavePlayRequest
import com.grudus.planshboard.tables.PlayResults.PLAY_RESULTS
import com.grudus.planshboard.tables.Plays.PLAYS
import com.grudus.planshboard.utils.randomId
import com.grudus.planshboard.utils.randomText
import org.jooq.DSLContext
import org.jooq.exception.DataAccessException
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.springframework.beans.factory.annotation.Autowired
import java.time.LocalDateTime
import kotlin.random.Random.Default.nextLong

class PlayDaoTest
@Autowired
constructor(
    private val playDao: PlayDao,
    private val boardGameDao: BoardGameDao,
    private val opponentDao: OpponentDao,
    private val dslContext: DSLContext
) : AbstractDatabaseTest() {

    @Test
    fun `should save play`() {
        val boardGameId = boardGameDao.create(addUser(), randomText())
        val id = playDao.savePlayAlone(
            SavePlayRequest(
                boardGameId,
                emptyList(),
                emptyList(),
                LocalDateTime.now(),
                randomText()
            )
        )

        assertNotNull(id)
        assertEquals(1, dslContext.fetchCount(PLAYS))
    }

    @Test
    fun `should not be able to save play with non existing board game`() {
        assertThrows<DataAccessException> {
            playDao.savePlayAlone(SavePlayRequest(1, emptyList(), emptyList(), LocalDateTime.now(), randomText()))
        }
    }

    @Test
    fun `should save play results`() {
        val creatorId = addUser()
        val boardGameId = boardGameDao.create(creatorId, randomText())
        val playId = playDao.savePlayAlone(
            SavePlayRequest(
                boardGameId,
                emptyList(),
                emptyList(),
                LocalDateTime.now(),
                randomText()
            )
        )
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
        val playId = playDao.savePlayAlone(
            SavePlayRequest(
                boardGameId,
                emptyList(),
                emptyList(),
                LocalDateTime.now(),
                randomText()
            )
        )

        assertThrows<DataAccessException> {
            playDao.savePlayResults(playId, listOf(PlayResult(1L)))
        }
    }

    @Test
    fun `should update play alone`() {
        val creatorId = addUser()
        val boardGameId = boardGameDao.create(creatorId, randomText())
        val playId = playDao.savePlayAlone(
            SavePlayRequest(
                boardGameId,
                emptyList(),
                emptyList(),
                LocalDateTime.now(),
                randomText()
            )
        )

        playDao.updatePlayAlone(playId, LocalDateTime.now(), "abc")

        val note = dsl.select(PLAYS.NOTE).from(PLAYS).fetchOne(PLAYS.NOTE)
        assertEquals("abc", note)
    }

    @Test
    fun `should detect play is created by user`() {
        val creatorId = addUser()
        val boardGameId = boardGameDao.create(creatorId, randomText())
        val id = playDao.savePlayAlone(
            SavePlayRequest(
                boardGameId,
                emptyList(),
                emptyList(),
                LocalDateTime.now(),
                randomText()
            )
        )

        val createdByUser = playDao.canBeAccessedByUser(creatorId, listOf(id))
        assertTrue(createdByUser)
    }

    @Test
    fun `should detect play is not created by user`() {
        val notCreatorId = addUser()
        val boardGameId = boardGameDao.create(addUser(), randomText())
        val id = playDao.savePlayAlone(
            SavePlayRequest(
                boardGameId,
                emptyList(),
                emptyList(),
                LocalDateTime.now(),
                randomText()
            )
        )

        val createdByUser = playDao.canBeAccessedByUser(notCreatorId, listOf(id))
        assertFalse(createdByUser)
    }

    @Test
    fun `should detect play is not created by user when play id does not exist`() {
        val userId = addUser()
        val boardGameId = boardGameDao.create(userId, randomText())
        playDao.savePlayAlone(SavePlayRequest(boardGameId, emptyList(), emptyList(), LocalDateTime.now(), randomText()))

        val createdByUser = playDao.canBeAccessedByUser(userId, listOf(randomId()))
        assertFalse(createdByUser)
    }

    @Test
    fun `should remove play results`() {
        val creatorId = addUser()
        val boardGameId = boardGameDao.create(creatorId, randomText())
        val playId = playDao.savePlayAlone(
            SavePlayRequest(
                boardGameId,
                emptyList(),
                emptyList(),
                LocalDateTime.now(),
                randomText()
            )
        )
        val playId2 = playDao.savePlayAlone(
            SavePlayRequest(
                boardGameId,
                emptyList(),
                emptyList(),
                LocalDateTime.now(),
                randomText()
            )
        )
        val opponentId = opponentDao.createNew(randomText(), creatorId)

        playDao.savePlayResults(playId, listOf(PlayResult(opponentId, 12, 12)))
        playDao.savePlayResults(playId2, listOf(PlayResult(opponentId, 12, 12)))

        playDao.removePlayResults(playId)

        assertEquals(1, dsl.fetchCount(PLAY_RESULTS))
    }

    @Test
    fun `should not remove play results when play doesn't exist`() {
        val creatorId = addUser()
        val boardGameId = boardGameDao.create(creatorId, randomText())
        val playId = playDao.savePlayAlone(
            SavePlayRequest(
                boardGameId,
                emptyList(),
                emptyList(),
                LocalDateTime.now(),
                randomText()
            )
        )
        val opponentId = opponentDao.createNew(randomText(), creatorId)

        playDao.savePlayResults(playId, listOf(PlayResult(opponentId, 12, 12)))
        playDao.removePlayResults(nextLong())

        assertEquals(1, dsl.fetchCount(PLAY_RESULTS))
    }
}
