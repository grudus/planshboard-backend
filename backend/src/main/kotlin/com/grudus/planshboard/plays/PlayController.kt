package com.grudus.planshboard.plays

import com.grudus.planshboard.auth.UserAuthentication
import com.grudus.planshboard.commons.responses.IdResponse
import com.grudus.planshboard.commons.responses.idOf
import com.grudus.planshboard.plays.model.CreatePlayRequest
import com.grudus.planshboard.plays.validators.CreatePlayRequestValidator
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/plays")
class PlayController
@Autowired
constructor(
    private val createPlayRequestValidator: CreatePlayRequestValidator,
    private val playService: PlayService
) {
    private val log = LoggerFactory.getLogger(javaClass.simpleName)

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun createPlay(@RequestBody request: CreatePlayRequest,
                   user: UserAuthentication): IdResponse {
        createPlayRequestValidator.validate(request).throwOnError()
        log.info("User[${user.id}] creates play: $request")
        return idOf(playService.createPlay(request))
    }

}
