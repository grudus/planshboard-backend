package com.grudus.planshboard.user

import com.grudus.planshboard.commons.Id
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class UserService
@Autowired
constructor(private val userDao: UserDao) {

    fun findIdByName(name: String): Id? =
        userDao.findByName(name)?.id

}
