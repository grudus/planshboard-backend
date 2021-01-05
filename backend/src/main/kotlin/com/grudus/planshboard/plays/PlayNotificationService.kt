package com.grudus.planshboard.plays

import com.grudus.planshboard.commons.Id
import com.grudus.planshboard.notifications.NotificationService
import com.grudus.planshboard.notifications.model.Notification
import com.grudus.planshboard.notifications.model.NotificationEventType
import com.grudus.planshboard.notifications.model.PlayNotification
import com.grudus.planshboard.opponents.OpponentService
import com.grudus.planshboard.plays.model.SavePlayRequest
import com.grudus.planshboard.user.CurrentUserService
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class PlayNotificationService
@Autowired
constructor(
    private val notificationService: NotificationService,
    private val opponentService: OpponentService,
    private val currentUserService: CurrentUserService
) {
    private val log = LoggerFactory.getLogger(javaClass.simpleName)


    fun notifyPlayCreated(request: SavePlayRequest, playId: Id): List<Notification<*>> {
        val opponentsIncludedInPlay = request.results.map { it.opponentId }.toSet()
        val usersToNotify = opponentService.findOpponentsLinkedWithRealUsers()
            .filter { opponent -> opponent.id in opponentsIncludedInPlay }
            .filter { opponent -> opponent.linkedUser != null }

        if (usersToNotify.isEmpty()) {
            log.info("No user need to know about play[$playId] creation")
            return emptyList()
        }

        val (creatorId, creatorDisplayName) = currentUserService.currentUser()

        val notifications = usersToNotify
            .map { opponent ->
                val userResult = request.results.find { result -> result.opponentId == opponent.id }
                Notification(
                    displayUserId = opponent.linkedUser!!.userId,
                    eventType = NotificationEventType.PLAY_ADDED,
                    eventData = PlayNotification(
                        creatorId,
                        creatorDisplayName,
                        playId,
                        request.boardGameId,
                        userResult?.position,
                        userResult?.points
                    )
                )
            }

        return notificationService.notifyMultiple(notifications)
    }

}
