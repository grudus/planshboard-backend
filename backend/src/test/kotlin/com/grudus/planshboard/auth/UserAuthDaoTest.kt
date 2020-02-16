package com.grudus.planshboard.auth

import com.grudus.planshboard.AbstractDatabaseTest
import com.grudus.planshboard.utils.randomText
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Test
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
        userAuthDao.registerUser(username, randomText(), now())
    }

}
