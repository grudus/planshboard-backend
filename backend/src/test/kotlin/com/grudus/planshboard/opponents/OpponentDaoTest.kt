package com.grudus.planshboard.opponents

import com.grudus.planshboard.AbstractDatabaseTest
import com.grudus.planshboard.opponents.model.LinkedOpponentStatus
import com.grudus.planshboard.opponents.model.OpponentListItem
import com.grudus.planshboard.utils.randomText
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import kotlin.random.Random.Default.nextLong

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
    fun `should check if all opponents are created by user`() {
        val creatorId = addUser()
        val names = listOf(randomText(), randomText())
        val ids = names.map {
            opponentDao.createNew(it, creatorId)
        }
        opponentDao.createNew(randomText(), creatorId)

        val allCreatedByUser = opponentDao.areAllCreatedByUser(ids, creatorId)

        assertTrue(allCreatedByUser)
    }

    @Test
    fun `should detect that not all opponents are created by user`() {
        val creatorId = addUser()
        val names = listOf(randomText(), randomText())
        val ids = names.map {
            opponentDao.createNew(it, creatorId)
        }
        opponentDao.createNew(randomText(), creatorId)

        val allCreatedByUser = opponentDao.areAllCreatedByUser(ids + nextLong(), creatorId)

        assertFalse(allCreatedByUser)
    }

    @Test
    fun `should detect that not all opponents are created by user when accessing another user's opponent`() {
        val user1Id = addUser()
        val user2Id = addUser()

        val opponentFromUser1Id = opponentDao.createNew(randomText(), user1Id)

        val allCreatedByUser = opponentDao.areAllCreatedByUser(listOf(opponentFromUser1Id), user2Id)

        assertFalse(allCreatedByUser)
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

    @Test
    fun `should update opponent's name`() {
        val newName = randomText()
        val id = opponentDao.createNew(randomText(), addUser())
        opponentDao.createNew(randomText(), addUser())

        opponentDao.updateName(id, newName)

        val opponent = opponentDao.findById(id)

        assertEquals(newName, opponent!!.name)
    }

    @Test
    fun `should update nothing when id doesn't match`() {
        val newName = randomText()
        val id = opponentDao.createNew(randomText(), addUser())
        opponentDao.createNew(randomText(), addUser())

        opponentDao.updateName(id + 1, newName)

        val opponent = opponentDao.findById(id)

        assertNotEquals(newName, opponent!!.name)
    }

    @Test
    fun `should remove link with the user`() {
        val id = opponentDao.createAndLinkToUser(randomText(), addUser(), addUser())

        opponentDao.removeLinkedUser(id)

        val opponent = opponentDao.findById(id)!!

        assertNull(opponent.linkedUser)
    }

    @Test
    fun `should not remove link with the user when id doesn't match`() {
        val id = opponentDao.createAndLinkToUser(randomText(), addUser(), addUser())

        opponentDao.removeLinkedUser(id + 1)

        val opponent = opponentDao.findById(id)!!

        assertNotNull(opponent.linkedUser)
    }


    @Test
    fun `should link existing opponent with user`() {
        val id = opponentDao.createNew(randomText(), addUser())
        val linkedUserId = addUser()
        opponentDao.linkToUser(id, linkedUserId, LinkedOpponentStatus.DISABLED)

        val opponent = opponentDao.findById(id)!!

        assertNotNull(opponent.linkedUser)
        assertEquals(linkedUserId, opponent.linkedUser!!.userId)
        assertEquals(LinkedOpponentStatus.DISABLED, opponent.linkedUser!!.status)
    }

    @Test
    fun `should return empty list when no opponent is linked with real user`() {
        val user = addUser()
        repeat(4) { opponentDao.createNew(randomText(), user) }

        val opponents = opponentDao.findOpponentsLinkedWithRealUsers(user)

        assertTrue(opponents.isEmpty())
    }

    @Test
    fun `should return only enabled opponents linked with real users`() {
        val user = addUser()
        opponentDao.createAndLinkToUser(randomText(), user, addUser(), LinkedOpponentStatus.WAITING_FOR_CONFIRMATION)
        val opponentId = opponentDao.createAndLinkToUser(randomText(), user, addUser(), LinkedOpponentStatus.ENABLED)
        opponentDao.createAndLinkToUser(randomText(), user, addUser(), LinkedOpponentStatus.DISABLED)

        val opponents = opponentDao.findOpponentsLinkedWithRealUsers(user)

        assertEquals(1, opponents.size)
        assertEquals(opponentId, opponents[0].id)
    }

}
