package com.grudus.planshboard.boardgames

import com.grudus.planshboard.auth.UserAuthentication
import com.grudus.planshboard.boardgames.model.BoardGame
import com.grudus.planshboard.boardgames.model.CreateBoardGameRequest
import com.grudus.planshboard.commons.responses.IdResponse
import com.grudus.planshboard.commons.responses.idOf
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/board-games")
class BoardGameController
@Autowired
constructor(private val boardGameService: BoardGameService,
            private val createBoardGameValidator: CreateBoardGameValidator) {
    private val log = LoggerFactory.getLogger(javaClass.simpleName)

    @GetMapping
    fun getBoardGames(user: UserAuthentication): List<BoardGame> {
        return boardGameService.findBoardGamesForUser(user.id)
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun createBoardGame(user: UserAuthentication,
                        @RequestBody request: CreateBoardGameRequest): IdResponse {
        createBoardGameValidator.validate(request)
        log.info("User[${user.id}] creates board game: $request")
        return idOf(boardGameService.createBoardGame(user.id, request))
    }

}
