package com.grudus.planshboard.plays

import com.grudus.planshboard.AbstractDatabaseTest
import com.grudus.planshboard.boardgames.BoardGameDao
import com.grudus.planshboard.commons.Id
import com.grudus.planshboard.opponents.OpponentService
import com.grudus.planshboard.opponents.model.LinkedOpponentStatus
import com.grudus.planshboard.opponents.model.SaveOpponentRequest
import com.grudus.planshboard.plays.model.PlayResult
import com.grudus.planshboard.plays.model.SavePlayRequest
import com.grudus.planshboard.plays.tags.TagDao
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
import java.time.LocalDateTime.now
import kotlin.random.Random.Default.nextLong

class PlayDaoTest
@Autowired
constructor(
    private val playDao: PlayDao,
    private val boardGameDao: BoardGameDao,
    private val opponentService: OpponentService,
    private val tagDao: TagDao,
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

        playDao.updatePlayAlone(playId, now(), "abc")

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

    @Test
    fun `should fetch all plays belonging to the user`() {
        val user1 = addUser()
        val user2 = addUser()
        val opponent1 = addRandomOpponent(user1)
        val opponent2 = addRandomOpponent(user1, linkedToUser = user2)

        val boardGameId1 = addRandomBoardGame(user1)
        val boardGameId2 = addRandomBoardGame(user2)

        playDao.savePlayResults(addRandomPlay(boardGameId1), listOf(PlayResult(opponent1, 12, 1)))
        playDao.savePlayResults(addRandomPlay(boardGameId1), listOf(PlayResult(opponent2)))
        playDao.savePlayResults(addRandomPlay(boardGameId1), listOf(PlayResult(opponent1)))
        playDao.savePlayResults(addRandomPlay(boardGameId2), listOf(PlayResult(opponent2)))

        assertEquals(3, playDao.getPlays(userId = user1).size)
        assertEquals(1, playDao.getPlays(userId = user2).size)
    }

    @Test
    fun `should fetch plays and sort them by play date by default`() {
        val user = addUser()
        val opponent = addRandomOpponent(user)

        val boardGameId = addRandomBoardGame(user)

        val play1 = addRandomPlay(boardGameId, date = now().minusMonths(2))
        val play2 = addRandomPlay(boardGameId, date = now().minusMonths(3))
        val play3 = addRandomPlay(boardGameId, date = now())

        playDao.savePlayResults(play1, listOf(PlayResult(opponent, 12, 1)))
        playDao.savePlayResults(play2, listOf(PlayResult(opponent)))
        playDao.savePlayResults(play3, listOf(PlayResult(opponent)))

        val plays = playDao.getPlays(userId = user)

        assertEquals(play3, plays[0].id)
        assertEquals(play1, plays[1].id)
        assertEquals(play2, plays[2].id)
    }

    @Test
    fun `should correctly fetch all play related data`() {
        val user = addUser()
        val opponent1 = addRandomOpponent(user)
        val opponent2 = addRandomOpponent(user)

        val boardGameId1 = addRandomBoardGame(user)
        val boardGameId2 = addRandomBoardGame(user)

        val play1 = addRandomPlay(boardGameId1, date = now())
        val play2 = addRandomPlay(boardGameId2, date = now().minusMonths(12))

        addTagsToPlay(user, play1, listOf("tag1", "tag2"))

        playDao.savePlayResults(play1, listOf(PlayResult(opponent1, 12, 1), PlayResult(opponent2, 33, 2)))
        playDao.savePlayResults(play2, listOf(PlayResult(opponent1), PlayResult(opponent2, null)))

        val plays = playDao.getPlays(userId = user)


        assertEquals(2, plays.size)
        assertEquals(play1, plays[0].id)
        assertEquals(boardGameId1, plays[0].boardGameId)
        assertEquals(listOf("tag1", "tag2"), plays[0].tags)
        val results1 = plays[0].results.sortedBy { it.position }
        assertEquals(PlayResult(opponent1, 12, 1), results1[0])
        assertEquals(PlayResult(opponent2, 33, 2), results1[1])

        assertEquals(play2, plays[1].id)
        assertEquals(boardGameId2, plays[1].boardGameId)
        assertTrue(plays[1].tags.isEmpty())
        val results2 = plays[1].results.sortedBy { it.position }
        assertEquals(PlayResult(opponent1), results2[0])
        assertEquals(PlayResult(opponent2, null), results2[1])
    }

    private fun addTagsToPlay(userId: Long, playId: Id, tags: List<String>) {
        val ids = tagDao.saveTags(tags, userId)
        tagDao.linkTagsToPlay(ids, playId)
    }


    private fun addRandomOpponent(
        creatorId: Id,
        linkedToUser: Id? = null,
        linkedStatus: LinkedOpponentStatus = LinkedOpponentStatus.ENABLED
    ) =
        if (linkedToUser == null) opponentService.create(SaveOpponentRequest(randomText()), creatorId)
        else opponentService.createAndLinkWithUser(randomText(), creatorId, linkedToUser, linkedStatus)

    private fun addRandomBoardGame(creatorId: Id) =
        boardGameDao.create(creatorId, randomText())

    private fun addRandomPlay(boardGameId: Id, date: LocalDateTime = now()) = playDao.savePlayAlone(
        SavePlayRequest(
            boardGameId,
            emptyList(),
            emptyList(),
            date,
            randomText()
        )
    )
}
