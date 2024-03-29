package com.grudus.planshboard.boardgames

import com.grudus.planshboard.AbstractDatabaseTest
import com.grudus.planshboard.boardgames.model.BoardGameOptions
import com.grudus.planshboard.boardgames.model.BoardGameType
import com.grudus.planshboard.boardgames.options.BoardGameOptionsDao
import com.grudus.planshboard.utils.randomText
import org.jooq.exception.DataAccessException
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertDoesNotThrow
import org.junit.jupiter.api.assertThrows
import org.springframework.beans.factory.annotation.Autowired
import kotlin.random.Random.Default.nextLong

class BoardGameDaoTest
@Autowired
constructor(private val boardGameDao: BoardGameDao,
            private val boardGameOptionsDao: BoardGameOptionsDao) : AbstractDatabaseTest() {

    @Test
    fun `should create board game and return id`() {
        val id = boardGameDao.create(firstUserId, randomText())

        assertNotNull(id)
    }

    @Test
    fun `should not be able to add 2 games with the same name and user`() {
        val name = randomText()

        boardGameDao.create(firstUserId, name)

        assertThrows<DataAccessException> {
            boardGameDao.create(firstUserId, name)
        }
    }

    @Test
    fun `should be able to add 2 games with the same name and different user`() {
        val name = randomText()

        boardGameDao.create(firstUserId, name)

        assertDoesNotThrow {
            boardGameDao.create(addUser(), name)
        }
    }

    @Test
    fun `should detect if name exists`() {
        val name = randomText()
        boardGameDao.create(firstUserId, name)
        boardGameDao.create(firstUserId, randomText())

        assertTrue(boardGameDao.nameExists(firstUserId, name))
    }

    @Test
    fun `should not detect that name exists for another user`() {
        val name = randomText()
        boardGameDao.create(firstUserId, name)
        boardGameDao.create(firstUserId, randomText())

        assertFalse(boardGameDao.nameExists(addUser(), name))
    }

    @Test
    fun `should not detect that name exists if not exist`() {
        boardGameDao.create(firstUserId, randomText())

        assertFalse(boardGameDao.nameExists(firstUserId, randomText()))
    }

    @Test
    fun `should find board games created by user`() {
        boardGameDao.create(firstUserId, randomText())
        boardGameDao.create(firstUserId, randomText())
        boardGameDao.create(addUser(), randomText())

        val boardGames = boardGameDao.findBoardGamesCreatedByUser(firstUserId)

        assertEquals(2, boardGames.size)
    }

    @Test
    fun `should return empty list when user does not have any board game`() {
        boardGameDao.create(addUser(), randomText())
        boardGameDao.create(addUser(), randomText())

        val boardGames = boardGameDao.findBoardGamesCreatedByUser(firstUserId)

        assertTrue(boardGames.isEmpty())
    }

    @Test
    fun `should be able to rename board game`() {
        val oldName = randomText()
        val newName = randomText()
        val id = boardGameDao.create(firstUserId, oldName)

        boardGameDao.rename(id, newName)

        val boardGame = boardGameDao.findBoardGamesCreatedByUser(firstUserId)[0]
        assertEquals(newName, boardGame.name)
    }

    @Test
    fun `should not be able to rename to existing name`() {
        val oldName = randomText()
        val newName = randomText()
        boardGameDao.create(firstUserId, newName)
        val id = boardGameDao.create(firstUserId, oldName)

        assertThrows<DataAccessException> {
            boardGameDao.rename(id, newName)
        }
    }

    @Test
    fun `should be able to rename board game to name created by another user`() {
        val oldName = randomText()
        val newName = randomText()
        boardGameDao.create(addUser(), newName)
        val id = boardGameDao.create(firstUserId, oldName)

        boardGameDao.rename(id, newName)

        val boardGame = boardGameDao.findBoardGamesCreatedByUser(firstUserId)[0]
        assertEquals(newName, boardGame.name)
    }

    @Test
    fun `should detect if game is created by user`() {
        boardGameDao.create(addUser(), randomText())
        val id = boardGameDao.create(firstUserId, randomText())

        val isCreatedByFirstUser = boardGameDao.isCreatedByUser(id, firstUserId)

        assertTrue(isCreatedByFirstUser)
    }

    @Test
    fun `should detect if game is not created by user`() {
        val id = boardGameDao.create(addUser(), randomText())
        boardGameDao.create(firstUserId, randomText())

        val isCreatedByFirstUser = boardGameDao.isCreatedByUser(id, firstUserId)

        assertFalse(isCreatedByFirstUser)
    }

    @Test
    fun `should find by id`() {
        val name = randomText()
        boardGameDao.create(addUser(), randomText())
        val id = boardGameDao.create(addUser(), name)
        boardGameDao.create(addUser(), randomText())

        val boardGame = boardGameDao.findById(id)

        assertNotNull(boardGame)
        assertEquals(name, boardGame!!.name)
    }

    @Test
    fun `should find by id with options`() {
        val name = randomText()
        val id = boardGameDao.create(addUser(), name)
        boardGameOptionsDao.createOptions(id, BoardGameOptions.default())

        val gameWithOptions = boardGameDao.findWithOptions(id)

        assertNotNull(gameWithOptions)
        assertEquals(name, gameWithOptions!!.boardGame.name)
        assertEquals(id, gameWithOptions.options.boardGameId)
    }

    @Test
    fun `should find correct options`() {
        val id = boardGameDao.create(addUser(), randomText())
        boardGameOptionsDao.createOptions(id, BoardGameOptions(gameType = BoardGameType.REGULAR, showDate = false, showNote = true, showPoints = false, showPosition = true, showTags = false, boardGameId = id))

        val gameWithOptions = boardGameDao.findWithOptions(id)

        assertNotNull(gameWithOptions)
        assertFalse(gameWithOptions!!.options.showDate)
        assertFalse(gameWithOptions.options.showPoints)
        assertFalse(gameWithOptions.options.showTags)
        assertTrue(gameWithOptions.options.showNote)
        assertTrue(gameWithOptions.options.showPosition)
    }

    @Test
    fun `should return null when cannot find by id`() {
        val name = randomText()
        val id = boardGameDao.create(addUser(), name)

        val boardGame = boardGameDao.findById(id + 1)

        assertNull(boardGame)
    }

    @Test
    fun `should delete board game by id`() {
        val id = boardGameDao.create(addUser(), randomText())
        boardGameDao.create(addUser(), randomText())

        boardGameDao.remove(id)

        val boardGame = boardGameDao.findById(id)

        assertNull(boardGame)
    }

    @Test
    fun `should not delete anything when id does not match`() {
        val creatorId = addUser()
        boardGameDao.create(creatorId, randomText())
        boardGameDao.create(creatorId, randomText())

        boardGameDao.remove(nextLong())

        val games = boardGameDao.findBoardGamesCreatedByUser(creatorId)

        assertEquals(2, games.size)
    }

}
