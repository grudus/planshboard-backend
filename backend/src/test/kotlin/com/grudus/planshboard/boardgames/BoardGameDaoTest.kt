package com.grudus.planshboard.boardgames

import com.grudus.planshboard.AbstractDatabaseTest
import com.grudus.planshboard.utils.randomText
import org.jooq.exception.DataAccessException
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertDoesNotThrow
import org.junit.jupiter.api.assertThrows
import org.springframework.beans.factory.annotation.Autowired

class BoardGameDaoTest
@Autowired
constructor(private val boardGameDao: BoardGameDao) : AbstractDatabaseTest() {

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
    fun `should return empty list when user is not linked to any board game`() {
        boardGameDao.create(firstUserId, randomText())

        val boardGames = boardGameDao.findBoardGamesLinkedFroUser(firstUserId)

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

}
