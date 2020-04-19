package com.grudus.planshboard.opponents

import com.grudus.planshboard.AbstractDatabaseTest
import com.grudus.planshboard.opponents.model.LinkedOpponentStatus
import com.grudus.planshboard.opponents.model.OpponentListItem
import com.grudus.planshboard.utils.randomText
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired

class OpponentDaoTest : AbstractDatabaseTest() {
    @Autowired
    private lateinit var opponentDao: OpponentDao


    @Test
    fun `should create initial opponent after adding user`() {
        val id = addUser()

        val opponents: List<OpponentListItem> = opponentDao.findListItems(id)
        assertEquals(1, opponents.size)
    }

    @Test
    fun `should be able to find by id`() {
        val id = addUser()
        val firstItemId = opponentDao.findListItems(id)[0].id

        val opponent = opponentDao.findById(firstItemId)

        assertNotNull(opponent)
        assertEquals(firstItemId, opponent!!.id)
    }

    @Test
    fun `should be able to create and find opponent without linked user`() {
        val creatorId = addUser()
        val name = randomText()
        val id = opponentDao.createNew(name, creatorId)

        val opponent = opponentDao.findById(id)

        assertNotNull(opponent)
        assertEquals(name, opponent!!.name)
    }

    @Test
    fun `should be able to create and find opponent with linked user`() {
        val creatorId = addUser()
        val name = randomText()
        val id = opponentDao.createAndLinkToUser(name, creatorId, addUser())

        val opponent = opponentDao.findById(id)

        assertNotNull(opponent)
        assertEquals(name, opponent!!.name)
    }


    @Test
    fun `should get opponent with linked user and it's status`() {
        val creatorId = addUser()
        val name = randomText()
        val linkedUserId = addUser()
        val id = opponentDao.createAndLinkToUser(name, creatorId, linkedUserId)

        val opponent = opponentDao.findById(id)

        assertNotNull(opponent)
        assertEquals(name, opponent!!.name)
        assertNotNull(opponent.linkedUser)
        assertEquals(linkedUserId, opponent.linkedUser!!.userId)
        assertEquals(LinkedOpponentStatus.WAITING_FOR_CONFIRMATION, opponent.linkedUser!!.status)
    }

    @Test
    fun `should be able to find all opponents`() {
        val creatorId = addUser()
        opponentDao.createNew(randomText(), creatorId)
        opponentDao.createAndLinkToUser(randomText(), creatorId, addUser())
        opponentDao.createAndLinkToUser(randomText(), creatorId, addUser())
        opponentDao.createAndLinkToUser(randomText(), addUser(), creatorId)

        val opponents = opponentDao.findListItems(creatorId)

        assertEquals(4, opponents.size) //one opponent is created when adding user
    }

    @Test
    fun `should detect if user is already linked`() {
        val creatorId = addUser()
        val linkedUserName = randomText()
        val linkedUser = addUser(linkedUserName)

        opponentDao.createAndLinkToUser(randomText(), creatorId, linkedUser)

        val userAlreadyLinked = opponentDao.userAlreadyLinked(linkedUserName, creatorId)

        assertTrue(userAlreadyLinked)
    }

    @Test
    fun `should check if is created by user`() {
        val creatorId = addUser()
        opponentDao.createNew(randomText(), creatorId)
        val id = opponentDao.createNew(randomText(), creatorId)

        val createdByUser = opponentDao.isCreatedByUser(id, creatorId)

        assertTrue(createdByUser)
    }

    @Test
    fun `should detect that opponent is not created by user`() {
        val creatorId = addUser()
        opponentDao.createNew(randomText(), creatorId)
        val id = opponentDao.createNew(randomText(), addUser())
        opponentDao.createAndLinkToUser(randomText(), addUser(), creatorId)

        val createdByUser = opponentDao.isCreatedByUser(id, creatorId)

        assertFalse(createdByUser)
    }

}