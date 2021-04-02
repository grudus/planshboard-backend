package com.grudus.planshboard.plays.notifications

import com.grudus.planshboard.auth.UserAuthentication
import com.grudus.planshboard.plays.PlayNotificationService
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/play-notifications")
class PlayNotificationController
@Autowired
constructor(
    private val playNotificationService: PlayNotificationService,
    private val acceptPlayParticipationRequestValidator: AcceptPlayParticipationRequestValidator
) {
    private val log = LoggerFactory.getLogger(javaClass.simpleName)


    @PostMapping("/accept")
    fun acceptPlayParticipation(
        @RequestBody request: AcceptPlayParticipationRequest,
        user: UserAuthentication
    ) {
        acceptPlayParticipationRequestValidator.validate(request).throwOnError()
        log.info("User[${user.id}] accepts participation in play from notification[${request.notificationId}]")
        playNotificationService.acceptPlayParticipationAndLinkEntities(request)
    }
}
