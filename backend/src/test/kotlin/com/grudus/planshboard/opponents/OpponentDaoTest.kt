package com.grudus.planshboard.opponents

import com.grudus.planshboard.AbstractDatabaseTest
import com.grudus.planshboard.opponents.linked.LinkedOpponentDao
import com.grudus.planshboard.opponents.model.LinkedOpponentStatus
import com.grudus.planshboard.opponents.model.LinkedOpponentStatus.WAITING_FOR_CONFIRMATION
import com.grudus.planshboard.opponents.model.OpponentListItem
import com.grudus.planshboard.utils.randomText
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import kotlin.random.Random.Default.nextLong

class OpponentDaoTest : AbstractDatabaseTest() {
    @Autowired
    private lateinit var opponentDao: OpponentDao

    @Autowired
    private lateinit var linkedOpponentDao: LinkedOpponentDao


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
    fun `should get opponent with linked user and it's status`() {
        val creatorId = addUser()
        val name = randomText()
        val linkedUserId = addUser()
        val id = opponentDao.createNew(name, creatorId)
        linkedOpponentDao.linkWithUser(id, linkedUserId, WAITING_FOR_CONFIRMATION)

        val opponent = opponentDao.findById(id)

        assertNotNull(opponent)
        assertEquals(name, opponent!!.name)
        assertNotNull(opponent.linkedUser)
        assertEquals(linkedUserId, opponent.linkedUser!!.userId)
        assertEquals(WAITING_FOR_CONFIRMATION, opponent.linkedUser!!.status)
    }

    @Test
    fun `should be able to find all opponents`() {
        val creatorId = addUser()
        opponentDao.createNew(randomText(), creatorId)
        opponentDao.createNew(randomText(), creatorId)
        opponentDao.createNew(randomText(), creatorId)

        val opponents = opponentDao.findListItems(creatorId)

        assertEquals(4, opponents.size) //one opponent is created when adding user
    }

    @Test
    fun `should check if is created by user`() {
        val creatorId = addUser()
        opponentDao.createNew(randomText(), creatorId)
        val id = opponentDao.createNew(randomText(), creatorId)

        val createdByUser = opponentDao.canBeAccessedByUser(creatorId, listOf(id))

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

        val allCreatedByUser = opponentDao.canBeAccessedByUser(creatorId, ids)

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

        val allCreatedByUser = opponentDao.canBeAccessedByUser(creatorId, ids + nextLong())

        assertFalse(allCreatedByUser)
    }

    @Test
    fun `should detect that not all opponents are created by user when accessing another user's opponent`() {
        val user1Id = addUser()
        val user2Id = addUser()

        val opponentFromUser1Id = opponentDao.createNew(randomText(), user1Id)

        val allCreatedByUser = opponentDao.canBeAccessedByUser(user2Id, listOf(opponentFromUser1Id))

        assertFalse(allCreatedByUser)
    }

    @Test
    fun `should detect that opponent is not created by user`() {
        val creatorId = addUser()
        opponentDao.createNew(randomText(), creatorId)
        val id = opponentDao.createNew(randomText(), addUser())
        linkedOpponentDao.linkWithUser(opponentDao.createNew(randomText(), addUser()), creatorId)

        val createdByUser = opponentDao.canBeAccessedByUser(creatorId, listOf(id))

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
    fun `should link existing opponent with user`() {
        val id = opponentDao.createNew(randomText(), addUser())
        val linkedUserId = addUser()
        linkedOpponentDao.linkWithUser(id, linkedUserId, LinkedOpponentStatus.DISABLED)

        val opponent = opponentDao.findById(id)!!

        assertNotNull(opponent.linkedUser)
        assertEquals(linkedUserId, opponent.linkedUser!!.userId)
        assertEquals(LinkedOpponentStatus.DISABLED, opponent.linkedUser!!.status)
    }


}
