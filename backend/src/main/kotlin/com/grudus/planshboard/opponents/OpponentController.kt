package com.grudus.planshboard.opponents

import com.grudus.planshboard.auth.UserAuthentication
import com.grudus.planshboard.opponents.model.OpponentListItem
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/opponents")
class OpponentController
@Autowired
constructor(private val opponentService: OpponentService) {

    @GetMapping
    fun findListItems(authentication: UserAuthentication): List<OpponentListItem> =
        opponentService.findListItems(authentication.id)

}
