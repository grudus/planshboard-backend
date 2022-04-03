package com.grudus.planshboard.auth

import com.grudus.planshboard.AbstractDatabaseTest
import com.grudus.planshboard.utils.randomText
import org.jooq.exception.DataAccessException
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.springframework.beans.factory.annotation.Autowired
import java.time.LocalDateTime.now

class UserAuthDaoTest
@Autowired
constructor(private val userAuthDao: UserAuthDao) : AbstractDatabaseTest() {

    @Test
    fun `should create user and return id`() {
        val id = userAuthDao.registerUser(randomText(), randomText(), now())

        assertNotNull(id)
    }

    @Test
    fun `should not be able to insert 2 users with the same username`() {
        val username = randomText()

        userAuthDao.registerUser(username, randomText(), now())
        assertThrows<DataAccessException> {
            userAuthDao.registerUser(username, randomText(), now())
        }
    }

    @Test
    fun `should be able to find user by username`() {
        val username = randomText()
        userAuthDao.registerUser(randomText(), randomText(), now())
        val id = userAuthDao.registerUser(username, randomText(), now())
        userAuthDao.registerUser(randomText(), randomText(), now())

        val user = userAuthDao.findByUsername(username)

        assertNotNull(user)
        assertEquals(username, user!!.username)
        assertEquals(id, user.id)
    }


    @Test
    fun `should return null when cannot find user by name`() {
        userAuthDao.registerUser(randomText(), randomText(), now())

        val user = userAuthDao.findByUsername(randomText())

        assertNull(user)
    }

    @Test
    fun `should detect user existence`() {
        val username = randomText()
        userAuthDao.registerUser(username, randomText(), now())
        userAuthDao.registerUser(randomText(), randomText(), now())

        val exists = userAuthDao.exists(username)

        assertTrue(exists)
    }

    @Test
    fun `should detect user does not exist`() {
        userAuthDao.registerUser(randomText(), randomText(), now())
        userAuthDao.registerUser(randomText(), randomText(), now())

        val exists = userAuthDao.exists(randomText())

        assertFalse(exists)
    }



}
