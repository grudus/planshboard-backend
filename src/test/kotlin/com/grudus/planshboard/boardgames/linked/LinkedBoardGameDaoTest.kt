package com.grudus.planshboard.boardgames.linked

import com.grudus.planshboard.AbstractDatabaseTest
import com.grudus.planshboard.boardgames.BoardGameDao
import com.grudus.planshboard.opponents.OpponentService
import com.grudus.planshboard.opponents.model.LinkedOpponentStatus.ENABLED
import com.grudus.planshboard.utils.randomText
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired

class LinkedBoardGameDaoTest
@Autowired
constructor(
    private val boardGameDao: BoardGameDao,
    private val linkedBoardGameDao: LinkedBoardGameDao,
    private val opponentService: OpponentService
) : AbstractDatabaseTest() {

    @Test
    fun `should link board game`() {
        val linkedUser = addUser()
        opponentService.createAndLinkWithUser(
            randomText(),
            creatorId = linkedUser,
            linkedTo = firstUserId,
            status = ENABLED
        )
        val boardGameId = boardGameDao.create(firstUserId, randomText())

        linkedBoardGameDao.linkBoardGame(linkedUser, boardGameId)

        val games = linkedBoardGameDao.findBoardGamesLinkedWithUser(linkedUser)

        assertEquals(1, games.size)
    }

    @Test
    fun `should ignore linked board game second time`() {
        val linkedUser = addUser()
        opponentService.createAndLinkWithUser(
            randomText(),
            creatorId = linkedUser,
            linkedTo = firstUserId,
            status = ENABLED
        )
        val boardGameId = boardGameDao.create(firstUserId, randomText())

        linkedBoardGameDao.linkBoardGame(linkedUser, boardGameId)
        linkedBoardGameDao.linkBoardGame(linkedUser, boardGameId)

        val games = linkedBoardGameDao.findBoardGamesLinkedWithUser(linkedUser)

        assertEquals(1, games.size)
    }

    @Test
    fun `should find board games linked with user`() {
        val linkedUser = addUser()
        opponentService.createAndLinkWithUser(
            randomText(),
            creatorId = linkedUser,
            linkedTo = firstUserId,
            status = ENABLED
        )
        val boardGameName = randomText()
        val boardGameId = boardGameDao.create(firstUserId, boardGameName)
        boardGameDao.create(linkedUser, boardGameName)

        linkedBoardGameDao.linkBoardGame(linkedUser, boardGameId)

        val games = linkedBoardGameDao.findBoardGamesLinkedWithUser(linkedUser)

        assertEquals(1, games.size)
        assertEquals(boardGameId, games[0].creatorBoardGame.id)
        assertEquals(boardGameName, games[0].creatorBoardGame.name)
        assertEquals(firstUserId, games[0].creator.linkedUser!!.userId)
    }

    @Test
    fun `should find board games linked with user from multiple creators`() {
        val creator1 = addUser(randomText())
        val creator2 = addUser(randomText())
        val linkedUser = addUser(randomText())

        opponentService.createAndLinkWithUser("Opp1", creatorId = linkedUser, linkedTo = creator1, status = ENABLED)
        opponentService.createAndLinkWithUser("Opp2", creatorId = linkedUser, linkedTo = creator2, status = ENABLED)
        opponentService.createAndLinkWithUser(
            "Opp3",
            creatorId = firstUserId,
            linkedTo = creator1,
            status = ENABLED
        ) // chaos

        linkedBoardGameDao.linkBoardGame(linkedUser, boardGameDao.create(creator1, "aGame"))
        linkedBoardGameDao.linkBoardGame(linkedUser, boardGameDao.create(creator1, "bGame"))
        linkedBoardGameDao.linkBoardGame(linkedUser, boardGameDao.create(creator2, "cGame"))
        linkedBoardGameDao.linkBoardGame(
            linkedUser,
            boardGameDao.create(firstUserId, "dGame")
        ) // shouldn't find, because not linked

        val games = linkedBoardGameDao.findBoardGamesLinkedWithUser(linkedUser)
            .sortedBy { it.creatorBoardGame.name }

        assertEquals(3, games.size)
        assertEquals("aGame", games[0].creatorBoardGame.name)
        assertEquals("bGame", games[1].creatorBoardGame.name)
        assertEquals("cGame", games[2].creatorBoardGame.name)
        assertEquals(creator1, games[0].creator.linkedUser!!.userId)
        assertEquals("Opp1", games[0].creator.name)
        assertEquals("Opp1", games[1].creator.name)
        assertEquals("Opp2", games[2].creator.name)
    }

    @Test
    fun `should return empty list when no games linked with user`() {
        val notLinkedUser = addUser("Not linked")
        val creator1 = addUser("Creator")

        opponentService.createAndLinkWithUser(
            "Opp nl-cr",
            creatorId = notLinkedUser,
            linkedTo = creator1,
            status = ENABLED
        )
        opponentService.createAndLinkWithUser(
            "Opp fu-nl",
            creatorId = firstUserId,
            linkedTo = notLinkedUser,
            status = ENABLED
        )

        linkedBoardGameDao.linkBoardGame(firstUserId, boardGameDao.create(creator1, "Game fu-c1"))
        linkedBoardGameDao.linkBoardGame(creator1, boardGameDao.create(firstUserId, "Game c1-fu"))

        val games = linkedBoardGameDao.findBoardGamesLinkedWithUser(notLinkedUser)

        assertTrue(games.isEmpty())
    }
}
