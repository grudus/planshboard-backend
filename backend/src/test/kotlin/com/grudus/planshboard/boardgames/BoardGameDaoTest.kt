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

}
