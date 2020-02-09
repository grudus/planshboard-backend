package com.grudus.planshboard.auth

import com.grudus.planshboard.tables.Users.USERS
import org.jooq.DSLContext
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Repository

@Repository
class UserAuthDao
@Autowired
constructor(private val dsl: DSLContext) {

    fun findByUsername(username: String): UserAuthDto? =
        dsl.select(USERS.ID, USERS.NAME, USERS.PASSWORD)
            .from(USERS)
            .fetchOneInto(UserAuthDto::class.java)
}
