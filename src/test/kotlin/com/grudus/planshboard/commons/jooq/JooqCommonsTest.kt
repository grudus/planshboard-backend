package com.grudus.planshboard.commons.jooq

import com.grudus.planshboard.AbstractDatabaseTest
import com.grudus.planshboard.tables.Tags.TAGS
import com.grudus.planshboard.tables.Users.USERS
import com.grudus.planshboard.tables.records.TagsRecord
import com.grudus.planshboard.tables.records.UsersRecord
import com.grudus.planshboard.user.model.User
import com.grudus.planshboard.utils.randomText
import org.jooq.exception.DataAccessException
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import java.time.LocalDateTime
import org.jooq.JSONB
import org.jooq.impl.DSL
import org.jooq.impl.DSL.*
import org.junit.jupiter.api.Assertions.*

class JooqCommonsTest : AbstractDatabaseTest() {

    @Test
    fun `should save multiple items and return theirs ids`() {
        val numberOfUsers = 3
        JooqCommons.insertMultipleAndReturnIds(
            dsl,
            USERS,
            listOf(UsersRecord(null, randomText(), randomText(), LocalDateTime.now()))
        )

        val users = (0 until numberOfUsers).map {
            UsersRecord(null, randomText(), randomText(), LocalDateTime.now())
        }

        val ids = JooqCommons.insertMultipleAndReturnIds(dsl, USERS, users)

        assertEquals(numberOfUsers, ids.size)

        ids.forEach { id ->
            val user = dsl.selectFrom(USERS).where(USERS.ID.eq(id)).fetchOne()
            assertNotNull(user)
        }
    }

    @Test
    fun `should not be able to add duplicates when inserting multiple`() {
        val tagTexts = listOf(randomText(), randomText())
        val userId = addUser()

        val tagRecords = tagTexts.map { tag ->
            TagsRecord(null, userId, tag)
        }

        JooqCommons.insertMultipleAndReturnIds(dsl, TAGS, tagRecords)

        assertThrows<DataAccessException> {
            JooqCommons.insertMultipleAndReturnIds(dsl, TAGS, tagRecords)
        }
    }

    @Test
    fun `should return ids in the collection's order`() {
        val users = (0 until 10).map {
            UsersRecord(null, randomText(), randomText(), LocalDateTime.now())
        }
        val ids = JooqCommons.insertMultipleAndReturnIds(dsl, USERS, users)

        ids.forEachIndexed { index, id ->
            val user = dsl.selectFrom(USERS).where(USERS.ID.eq(id)).fetchOne()!!
            assertEquals(user.name, users[index].name)
            assertEquals(user.password, users[index].password)
        }
    }

    @Test
    fun `should parse JSONB value`() {
        val users = (0 until 10).map {
            UsersRecord(null, it.toString() + randomText(), randomText(), LocalDateTime.now())
        }
        val ids = JooqCommons.insertMultipleAndReturnIds(dsl, USERS, users)

        val alias = field("result", Array<JSONB>::class.java)
        val results = dsl.select(arrayAgg(jsonbObject(USERS.ID, USERS.NAME)).`as`(alias)).from(USERS).fetch()

        val parsedUsers = JooqCommons.parseJsonBArray(results[0], alias, User::class.java)

        assertEquals(10, parsedUsers.size)
        assertTrue(parsedUsers.map { it.id }.containsAll(ids))
    }
}
