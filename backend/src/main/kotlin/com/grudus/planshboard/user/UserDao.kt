package com.grudus.planshboard.user

import com.grudus.planshboard.commons.Id
import com.grudus.planshboard.tables.Users.USERS
import com.grudus.planshboard.user.model.User
import org.jooq.DSLContext
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.RestController

@RestController
class UserDao
@Autowired
constructor(private val dsl: DSLContext) {

    fun findByName(name: String): User? =
        dsl.selectFrom(USERS)
            .where(USERS.NAME.eq(name))
            .fetchOneInto(User::class.java)
}
