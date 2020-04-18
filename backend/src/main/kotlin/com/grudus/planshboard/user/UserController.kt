package com.grudus.planshboard.user

import com.grudus.planshboard.user.model.CurrentUser
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/users")
class UserController
@Autowired
constructor(private val currentUserService: CurrentUserService){

    @GetMapping("/me")
    fun current(): CurrentUser =
        currentUserService.currentUser()

}
