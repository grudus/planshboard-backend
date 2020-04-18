package com.grudus.planshboard.opponents

import com.grudus.planshboard.AbstractDatabaseTest
import com.grudus.planshboard.opponents.model.OpponentListItem
import com.grudus.planshboard.utils.randomText
import org.jooq.exception.DataAccessException
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
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
    fun `should not be able to create initial opponent twice`() {
        val id = addUser()

        assertThrows<DataAccessException> {
            opponentDao.creteInitial(randomText(), id)
        }
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

}
