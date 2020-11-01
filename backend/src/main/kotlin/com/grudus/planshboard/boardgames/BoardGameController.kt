package com.grudus.planshboard.boardgames

import com.grudus.planshboard.auth.UserAuthentication
import com.grudus.planshboard.boardgames.model.BoardGame
import com.grudus.planshboard.boardgames.model.CreateBoardGameRequest
import com.grudus.planshboard.boardgames.model.EditBoardGameRequest
import com.grudus.planshboard.boardgames.model.SingleBoardGameResponse
import com.grudus.planshboard.boardgames.validators.CreateBoardGameRequestValidator
import com.grudus.planshboard.boardgames.validators.EditBoardGameRequestValidator
import com.grudus.planshboard.commons.Id
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
            private val boardGameSecurityService: BoardGameSecurityService,
            private val createBoardGameRequestValidator: CreateBoardGameRequestValidator,
            private val editBoardGameRequestValidator: EditBoardGameRequestValidator) {
    private val log = LoggerFactory.getLogger(javaClass.simpleName)

    @GetMapping
    fun getBoardGames(user: UserAuthentication): List<BoardGame> {
        return boardGameService.findBoardGamesForUser(user.id)
    }

    @GetMapping("/{boardGameId}")
    fun getSingleBoardGame(user: UserAuthentication, @PathVariable boardGameId: Id): SingleBoardGameResponse? {
        boardGameSecurityService.checkAccess(boardGameId)
        return boardGameService.findById(boardGameId)
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun createBoardGame(user: UserAuthentication,
                        @RequestBody request: CreateBoardGameRequest): IdResponse {
        createBoardGameRequestValidator.validate(request).throwOnError()
        log.info("User[${user.id}] creates board game: $request")
        return idOf(boardGameService.createBoardGame(user.id, request))
    }

    @DeleteMapping("/{boardGameId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun removeBoardGame(user: UserAuthentication,
                        @PathVariable boardGameId: Id) {
        boardGameSecurityService.checkAccess(boardGameId)
        log.info("User[${user.id}] removes board game[$boardGameId]")
        boardGameService.remove(boardGameId)
    }


    @PutMapping("/{boardGameId}")
    fun renameBoardGame(user: UserAuthentication,
                        @RequestBody request: EditBoardGameRequest,
                        @PathVariable boardGameId: Id) {
        boardGameSecurityService.checkAccess(boardGameId)
        editBoardGameRequestValidator.validate(request).throwOnError()
        log.info("User[${user.id}] edits board game[$boardGameId]: $request")
        boardGameService.edit(boardGameId, request)
    }
}
