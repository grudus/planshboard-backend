package com.grudus.planshboard.plays.notifications

import com.grudus.planshboard.boardgames.linked.LinkedBoardGameService
import com.grudus.planshboard.commons.Id
import com.grudus.planshboard.commons.exceptions.ResourceNotFoundException
import com.grudus.planshboard.commons.utils.toEnumNames
import com.grudus.planshboard.notifications.NotificationService
import com.grudus.planshboard.notifications.model.MarkAsReadRequest
import com.grudus.planshboard.notifications.model.Notification
import com.grudus.planshboard.notifications.model.NotificationEventType
import com.grudus.planshboard.notifications.model.PlayNotification
import com.grudus.planshboard.notifications.model.PlayNotification.PossibleActions.*
import com.grudus.planshboard.opponents.linked.LinkedOpponentService
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
    private val linkedOpponentService: LinkedOpponentService,
    private val currentUserService: CurrentUserService,
    private val linkedBoardGameService: LinkedBoardGameService
) {
    private val log = LoggerFactory.getLogger(javaClass.simpleName)


    fun notifyPlayCreated(request: SavePlayRequest, playId: Id): List<Notification<*>> {
        val opponentsIncludedInPlay = request.results.map { it.opponentId }.toSet()
        val usersToNotify = linkedOpponentService.findOpponentsLinkedWithRealUsers()
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
                    ),
                    possibleActions = listOf(ACCEPT, ACCEPT_ALL, REJECT).toEnumNames()
                )
            }

        return notificationService.notifyMultiple(notifications)
    }

    fun acceptPlayParticipationAndLinkEntities(request: AcceptPlayParticipationRequest) {
        val notification: PlayNotification =
            notificationService.findNotificationData(request.notificationId, PlayNotification::class.java)
                ?: throw ResourceNotFoundException("Cannot find notification with id [${request.notificationId}]")

        val newGameLinked =
            linkedBoardGameService.linkBoardGame(currentUserService.currentUserId(), notification.boardGameId) > 0
        if (newGameLinked) {
            log.info("Board game[${notification.boardGameId}] linked with user[${currentUserService.currentUserId()}]")
        }

        notificationService.markAsRead(MarkAsReadRequest(request.notificationId))
    }

}
