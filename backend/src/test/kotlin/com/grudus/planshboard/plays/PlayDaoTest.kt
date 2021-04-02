package com.grudus.planshboard.plays

import com.grudus.planshboard.AbstractDatabaseTest
import com.grudus.planshboard.boardgames.BoardGameDao
import com.grudus.planshboard.commons.Id
import com.grudus.planshboard.opponents.OpponentDao
import com.grudus.planshboard.opponents.model.LinkedOpponentStatus
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
        val boardGameId = addRandomBoardGame(addUser())
        val id = addRandomPlay(boardGameId)

        assertNotNull(id)
        assertEquals(1, dslContext.fetchCount(PLAYS))
    }

    @Test
    fun `should not be able to save play with non existing board game`() {
        assertThrows<DataAccessException> {
            addRandomPlay(1)
        }
    }

    @Test
    fun `should save play results`() {
        val creatorId = addUser()
        val boardGameId = addRandomBoardGame(creatorId)
        val playId = addRandomPlay(boardGameId)
        val opponentId = addRandomOpponent(creatorId)

        playDao.savePlayResults(playId, listOf(PlayResult(opponentId, 12, 12)))

        assertEquals(1, dsl.fetchCount(PLAY_RESULTS))
    }

    @Test
    fun `should not be able to save results with non existing play`() {
        val creatorId = addUser()
        val opponentId = addRandomOpponent(creatorId)

        assertThrows<DataAccessException> {
            playDao.savePlayResults(1L, listOf(PlayResult(opponentId, 12, 12)))
        }
    }

    @Test
    fun `should not be able to save results with non existing opponent`() {
        val creatorId = addUser()
        val boardGameId = addRandomBoardGame(creatorId)
        val playId = addRandomPlay(boardGameId)

        assertThrows<DataAccessException> {
            playDao.savePlayResults(playId, listOf(PlayResult(1L)))
        }
    }

    @Test
    fun `should update play alone`() {
        val creatorId = addUser()
        val boardGameId = addRandomBoardGame(creatorId)
        val playId = addRandomPlay(boardGameId)

        playDao.updatePlayAlone(playId, LocalDateTime.now(), "abc")

        val note = dsl.select(PLAYS.NOTE).from(PLAYS).fetchOne(PLAYS.NOTE)
        assertEquals("abc", note)
    }

    @Test
    fun `should detect play is created by user`() {
        val creatorId = addUser()
        val boardGameId = addRandomBoardGame(creatorId)
        val id = addRandomPlay(boardGameId)

        val createdByUser = playDao.canBeAccessedByUser(creatorId, listOf(id))
        assertTrue(createdByUser)
    }

    @Test
    fun `should detect play is not created by user`() {
        val notCreatorId = addUser()
        val boardGameId = addRandomBoardGame(addUser())
        val id = addRandomPlay(boardGameId)

        val createdByUser = playDao.canBeAccessedByUser(notCreatorId, listOf(id))
        assertFalse(createdByUser)
    }

    @Test
    fun `should detect play is not created by user when play id does not exist`() {
        val userId = addUser()
        val boardGameId = addRandomBoardGame(userId)
        addRandomPlay(boardGameId)

        val createdByUser = playDao.canBeAccessedByUser(userId, listOf(randomId()))
        assertFalse(createdByUser)
    }

    @Test
    fun `should remove play results`() {
        val creatorId = addUser()
        val boardGameId = addRandomBoardGame(creatorId)
        val playId = addRandomPlay(boardGameId)
        val playId2 = addRandomPlay(boardGameId)
        val opponentId = addRandomOpponent(creatorId)

        playDao.savePlayResults(playId, listOf(PlayResult(opponentId, 12, 12)))
        playDao.savePlayResults(playId2, listOf(PlayResult(opponentId, 12, 12)))

        playDao.removePlayResults(playId)

        assertEquals(1, dsl.fetchCount(PLAY_RESULTS))
    }

    @Test
    fun `should not remove play results when play doesn't exist`() {
        val creatorId = addUser()
        val boardGameId = addRandomBoardGame(creatorId)
        val playId = addRandomPlay(boardGameId)
        val opponentId = addRandomOpponent(creatorId)

        playDao.savePlayResults(playId, listOf(PlayResult(opponentId, 12, 12)))
        playDao.removePlayResults(nextLong())

        assertEquals(1, dsl.fetchCount(PLAY_RESULTS))
    }

    @Test
    fun `should check if user participated in play`() {
        val creatorId = addUser()
        val participantId = addUser()
        val boardGameId = addRandomBoardGame(creatorId)
        val playId = addRandomPlay(boardGameId)

        val opponent1 = addRandomOpponent(creatorId)
        val participantOpponent = addRandomOpponent(creatorId, linkedToUser = participantId)

        playDao.savePlayResults(playId, listOf(PlayResult(opponent1), PlayResult(participantOpponent, 23)))

        val userParticipatedInPlay = playDao.userParticipatedInPlay(participantId, playId)

        assertTrue(userParticipatedInPlay)
    }

    @Test
    fun `should detect that user does not participate in play`() {
        val creatorId = addUser()
        val notParticipantId = addUser()
        val boardGameId = addRandomBoardGame(creatorId)
        val playId = addRandomPlay(boardGameId)

        val opponent1 = addRandomOpponent(creatorId)
        addRandomOpponent(creatorId, linkedToUser = notParticipantId)

        playDao.savePlayResults(playId, listOf(PlayResult(opponent1)))

        val userParticipatedInPlay = playDao.userParticipatedInPlay(notParticipantId, playId)

        assertFalse(userParticipatedInPlay)
    }

    @Test
    fun `should detect that user doesn't participate in a specific play when he participated in another one`() {
        val creatorId = addUser()
        val participantId = addUser()
        val boardGameId = addRandomBoardGame(creatorId)
        val notParticiplePlayId = addRandomPlay(boardGameId)
        val participlePlayId = addRandomPlay(boardGameId)

        val opponent1 = addRandomOpponent(creatorId)
        val participantOpponent = addRandomOpponent(creatorId, linkedToUser = participantId)

        playDao.savePlayResults(notParticiplePlayId, listOf(PlayResult(opponent1)))
        playDao.savePlayResults(participlePlayId, listOf(PlayResult(participantOpponent)))

        val userParticipatedInPlay1 = playDao.userParticipatedInPlay(participantId, notParticiplePlayId)
        val userParticipatedInPlay2 = playDao.userParticipatedInPlay(participantId, participlePlayId)

        assertFalse(userParticipatedInPlay1)
        assertTrue(userParticipatedInPlay2)
    }

    private fun addRandomOpponent(
        creatorId: Id,
        linkedToUser: Id? = null,
        linkedStatus: LinkedOpponentStatus = LinkedOpponentStatus.ENABLED
    ) =
        if (linkedToUser == null) opponentDao.createNew(randomText(), creatorId)
        else opponentDao.createAndLinkToUser(randomText(), creatorId, linkedToUser, linkedStatus)

    private fun addRandomBoardGame(creatorId: Id) =
        boardGameDao.create(creatorId, randomText())

    private fun addRandomPlay(boardGameId: Id) = playDao.savePlayAlone(
        SavePlayRequest(
            boardGameId,
            emptyList(),
            emptyList(),
            LocalDateTime.now(),
            randomText()
        )
    )
}
