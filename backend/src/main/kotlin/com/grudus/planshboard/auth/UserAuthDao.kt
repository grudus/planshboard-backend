package com.grudus.planshboard.auth

import com.grudus.planshboard.commons.Id
import com.grudus.planshboard.tables.Users.USERS
import org.jooq.DSLContext
import org.jooq.impl.DSL
import org.jooq.impl.DSL.count
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Repository
import java.time.LocalDateTime

@Repository
class UserAuthDao
@Autowired
constructor(private val dsl: DSLContext) {

    fun findByUsername(username: String): UserAuthDto? =
        dsl.select(USERS.ID, USERS.NAME, USERS.PASSWORD)
            .from(USERS)
            .fetchOneInto(UserAuthDto::class.java)

    fun registerUser(username: String, password: String, registerDate: LocalDateTime): Id =
        dsl.insertInto(USERS, USERS.NAME, USERS.PASSWORD, USERS.REGISTER_DATE)
            .values(username, password, registerDate)
            .returning()
            .fetchOne()
            .id

    fun exists(username: String): Boolean =
        dsl.select(count())
            .from(USERS)
            .where(USERS.NAME.eq(username))
            .fetchOneInto(Int::class.java) > 0
}
