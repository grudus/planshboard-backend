package com.grudus.planshboard.opponents.notifications

import com.grudus.planshboard.commons.Id
import com.grudus.planshboard.notifications.NotificationService
import com.grudus.planshboard.notifications.model.Notification
import com.grudus.planshboard.notifications.model.NotificationEventType
import com.grudus.planshboard.notifications.model.OpponentLinkedNotification
import com.grudus.planshboard.user.CurrentUserService
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class OpponentNotificationService
@Autowired
constructor(
    private val notificationService: NotificationService,
    private val currentUserService: CurrentUserService
) {
    private val log = LoggerFactory.getLogger(javaClass.simpleName)

    fun notifyOpponentLinked(opponentId: Id, linkedUserId: Id): Notification<OpponentLinkedNotification> {
        val currentUser = currentUserService.currentUser()
        log.info("Notifying user[$linkedUserId] about being linked with opponent[${opponentId}] by user[${currentUser.id}]")
        return notificationService.notify(
            Notification(
                displayUserId = linkedUserId,
                eventType = NotificationEventType.OPPONENT_LINKED,
                eventData = OpponentLinkedNotification(currentUser.id, currentUser.username, opponentId)
            )
        )

    }

}
