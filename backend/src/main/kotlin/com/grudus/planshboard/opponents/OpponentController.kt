package com.grudus.planshboard.opponents

import com.grudus.planshboard.auth.UserAuthentication
import com.grudus.planshboard.commons.Id
import com.grudus.planshboard.commons.responses.IdResponse
import com.grudus.planshboard.commons.responses.idOf
import com.grudus.planshboard.opponents.model.CreateOpponentRequest
import com.grudus.planshboard.opponents.model.OpponentListItem
import com.grudus.planshboard.opponents.model.OpponentWithStats
import com.grudus.planshboard.opponents.validators.CreateOpponentRequestValidator
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
            private val createOpponentRequestValidator: CreateOpponentRequestValidator) {
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
    fun create(@RequestBody request: CreateOpponentRequest,
               user: UserAuthentication): IdResponse {
        createOpponentRequestValidator.validate(request).throwOnError()
        log.info("User[${user.id}] creates opponent: $request")
        return idOf(opponentService.create(request, user.id))
    }

}
