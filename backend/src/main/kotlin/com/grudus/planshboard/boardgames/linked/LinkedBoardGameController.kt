package com.grudus.planshboard.boardgames.linked

import com.grudus.planshboard.auth.UserAuthentication
import com.grudus.planshboard.boardgames.model.LinkedBoardGame
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/board-games/lined")
class LinkedBoardGameController
@Autowired
constructor(private val linkedBoardGameService: LinkedBoardGameService) {

    @GetMapping
    fun findLinked(user: UserAuthentication): List<LinkedBoardGame> =
        linkedBoardGameService.findBoardGamesLinkedWithUser(user.id)
}
