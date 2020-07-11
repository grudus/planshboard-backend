package com.grudus.planshboard.plays

import com.grudus.planshboard.auth.UserAuthentication
import com.grudus.planshboard.commons.Id
import com.grudus.planshboard.commons.responses.IdResponse
import com.grudus.planshboard.commons.responses.idOf
import com.grudus.planshboard.plays.model.PlayListItem
import com.grudus.planshboard.plays.model.SavePlayRequest
import com.grudus.planshboard.plays.validators.SavePlayRequestValidator
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/plays")
class PlayController
@Autowired
constructor(
    private val savePlayRequestValidator: SavePlayRequestValidator,
    private val playService: PlayService,
    private val playSecurityService: PlaySecurityService
) {
    private val log = LoggerFactory.getLogger(javaClass.simpleName)

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun createPlay(@RequestBody request: SavePlayRequest,
                   user: UserAuthentication): IdResponse {
        savePlayRequestValidator.validate(request).throwOnError()
        log.info("User[${user.id}] creates play: $request")
        return idOf(playService.createPlay(request))
    }

    // TODO Write tests when getPlay implemented
    @PutMapping("/{playId}")
    fun updatePlay(@RequestBody request: SavePlayRequest,
                   @PathVariable playId: Id,
                   user: UserAuthentication) {
        playSecurityService.checkAccess(playId)
        savePlayRequestValidator.validate(request).throwOnError()
        log.info("User[${user.id}] updates play[$playId]: $request")
        playService.updatePlay(playId, request)
    }

    @GetMapping
    fun getPlays(user: UserAuthentication): List<PlayListItem> =
        playService.getPlays(user.id)

}
