package com.grudus.planshboard.opponents.linked

import com.grudus.planshboard.AbstractDatabaseTest
import com.grudus.planshboard.commons.Id
import com.grudus.planshboard.opponents.OpponentDao
import com.grudus.planshboard.opponents.model.LinkedOpponentStatus
import com.grudus.planshboard.opponents.model.LinkedOpponentStatus.*
import com.grudus.planshboard.utils.randomText
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired

class LinkedOpponentDaoTest : AbstractDatabaseTest() {
    @Autowired
    private lateinit var linkedOpponentDao: LinkedOpponentDao

    @Autowired
    private lateinit var opponentDao: OpponentDao


    @Test
    fun `should detect if user is already linked`() {
        val creatorId = addUser()
        val linkedUserName = randomText()
        val linkedUser = addUser(linkedUserName)

        createAndLinkWithUser(randomText(), creatorId, linkedUser)

        val userAlreadyLinked = linkedOpponentDao.userAlreadyLinked(linkedUserName, creatorId)

        assertTrue(userAlreadyLinked)
    }

    @Test
    fun `should remove link with the user`() {
        val id = createAndLinkWithUser(randomText(), addUser(), addUser())

        linkedOpponentDao.removeLinkedUser(id)

        val opponent = opponentDao.findById(id)!!

        Assertions.assertNull(opponent.linkedUser)
    }

    @Test
    fun `should not remove link with the user when id doesn't match`() {
        val id = createAndLinkWithUser(randomText(), addUser(), addUser())

        linkedOpponentDao.removeLinkedUser(id + 1)

        val opponent = opponentDao.findById(id)!!

        Assertions.assertNotNull(opponent.linkedUser)
    }

    @Test
    fun `should return only enabled opponents linked with real users`() {
        val user = addUser()
        createAndLinkWithUser(randomText(), user, addUser(), WAITING_FOR_CONFIRMATION)
        val opponentId = createAndLinkWithUser(randomText(), user, addUser(), ENABLED)
        createAndLinkWithUser(randomText(), user, addUser(), DISABLED)

        val opponents = linkedOpponentDao.findOpponentsLinkedWithRealUsers(user)

        assertEquals(1, opponents.size)
        assertEquals(opponentId, opponents[0].id)
    }


    @Test
    fun `should return empty list when no opponent is linked with real user`() {
        val user = addUser()
        repeat(4) { opponentDao.createNew(randomText(), user) }

        val opponents = linkedOpponentDao.findOpponentsLinkedWithRealUsers(user)

        assertTrue(opponents.isEmpty())
    }

    @Test
    fun `should be able to override status when linking same opponent twice`() {
        val opponentId = opponentDao.createNew(randomText(), addUser())
        linkedOpponentDao.linkWithUser(opponentId, addUser(), WAITING_FOR_CONFIRMATION)

        assertEquals(WAITING_FOR_CONFIRMATION, opponentDao.findById(opponentId)!!.linkedUser!!.status)

        linkedOpponentDao.linkWithUser(opponentId, addUser(), ENABLED)

        assertEquals(ENABLED, opponentDao.findById(opponentId)!!.linkedUser!!.status)
    }

    private fun createAndLinkWithUser(
        name: String,
        creatorId: Id,
        linkedUser: Id,
        status: LinkedOpponentStatus = WAITING_FOR_CONFIRMATION
    ): Id {
        val opponentId = opponentDao.createNew(name, creatorId)
        linkedOpponentDao.linkWithUser(opponentId, linkedUser, status)
        return opponentId
    }


}
