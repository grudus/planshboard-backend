package com.grudus.planshboard.opponents

import com.grudus.planshboard.auth.UserAuthentication
import com.grudus.planshboard.commons.Id
import com.grudus.planshboard.commons.responses.IdResponse
import com.grudus.planshboard.commons.responses.idOf
import com.grudus.planshboard.opponents.model.OpponentListItem
import com.grudus.planshboard.opponents.model.OpponentWithStats
import com.grudus.planshboard.opponents.model.SaveOpponentRequest
import com.grudus.planshboard.opponents.validators.SaveOpponentRequestValidator
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/opponents")
class OpponentController
@Autowired
constructor(private val opponentService: OpponentService,
            private val opponentSecurityService: OpponentSecurityService,
            private val saveOpponentRequestValidator: SaveOpponentRequestValidator) {
    private val log = LoggerFactory.getLogger(javaClass.simpleName)

    @GetMapping
    fun findListItems(authentication: UserAuthentication): List<OpponentListItem> =
        opponentService.findListItems(authentication.id)

    @GetMapping("/{id}")
    fun getSingleOpponentWithStats(@PathVariable("id") opponentId: Id,
                                   authentication: UserAuthentication): OpponentWithStats {
        opponentSecurityService.checkAccess(opponentId)
        return opponentService.getWithStats(opponentId, authentication.id)
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun create(@RequestBody request: SaveOpponentRequest,
               user: UserAuthentication): IdResponse {
        saveOpponentRequestValidator.validate(request).throwOnError()
        log.info("User[${user.id}] creates opponent: $request")
        return idOf(opponentService.create(request, user.id))
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun update(@RequestBody request: SaveOpponentRequest,
               @PathVariable("id") opponentId: Id,
               user: UserAuthentication) {
        opponentSecurityService.checkAccess(opponentId)
        saveOpponentRequestValidator.validate(request, opponentId).throwOnError()
        log.info("User[${user.id}] updates opponent[$opponentId]: $request")
        opponentService.update(opponentId, request)
    }

}
