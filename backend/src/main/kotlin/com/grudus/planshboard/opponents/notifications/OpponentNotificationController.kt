package com.grudus.planshboard.opponents.notifications

import com.grudus.planshboard.auth.UserAuthentication
import com.grudus.planshboard.opponents.linked.LinkedOpponentService
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/opponent-notifications")
class OpponentNotificationController
@Autowired
constructor(
    private val linkedOpponentService: LinkedOpponentService,
    private val acceptOpponentLinkedRequestValidator: AcceptOpponentLinkedRequestValidator
) {
    private val log = LoggerFactory.getLogger(javaClass.simpleName)

    @PostMapping("/accept")
    fun acceptLinkedWithUser(
        @RequestBody request: AcceptOpponentLinkedRequest,
        user: UserAuthentication
    ) {
        acceptOpponentLinkedRequestValidator.validate(request).throwOnError()
        log.info("User[${user.id}] accepts linking with opponent from notification[${request.notificationId}]")
        linkedOpponentService.acceptLinking(request)
    }

}
