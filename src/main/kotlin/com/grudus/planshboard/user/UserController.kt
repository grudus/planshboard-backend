package com.grudus.planshboard.user

import com.grudus.planshboard.commons.exceptions.UserHasNoAccessToResourceException
import com.grudus.planshboard.user.model.CurrentUser
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/users")
class UserController
@Autowired
constructor(private val currentUserService: CurrentUserService,
            private val userService: UserService) {

    @GetMapping("/me")
    fun checkAccessForCurrentUser(): CurrentUser {
        val currentUser = currentUserService.currentUser()
        assertExists(currentUser)
        return currentUser
    }

    private fun assertExists(currentUser: CurrentUser) {
        val exists = userService.findIdByName(currentUser.username) != null
        if (!exists)
            throw UserHasNoAccessToResourceException("Cannot obtain user with name [${currentUser.username}]")
    }

}
