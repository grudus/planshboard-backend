package com.grudus.planshboard.opponents.linked

import com.grudus.planshboard.commons.Id
import com.grudus.planshboard.opponents.model.LinkedOpponentStatus
import com.grudus.planshboard.opponents.model.LinkedOpponentStatus.*
import com.grudus.planshboard.opponents.model.OpponentDto
import com.grudus.planshboard.opponents.notifications.AcceptOpponentLinkedRequest
import com.grudus.planshboard.opponents.notifications.OpponentNotificationService
import com.grudus.planshboard.user.CurrentUserService
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class LinkedOpponentService
@Autowired
constructor(
    private val linkedOpponentDao: LinkedOpponentDao,
    private val currentUserService: CurrentUserService,
    private val opponentNotificationService: OpponentNotificationService
) {
    private val log = LoggerFactory.getLogger(javaClass.simpleName)

    fun linkWithCreator(opponentId: Id, userCreatorId: Id) {
        linkWithUser(opponentId, userCreatorId, LINKED_WITH_CREATOR)
    }

    fun linkWithUser(
        opponentId: Id,
        userId: Id,
        status: LinkedOpponentStatus = WAITING_FOR_CONFIRMATION
    ) {
        log.info("About to link opponent[$opponentId] with user[$userId] with status $status")
        linkedOpponentDao.linkWithUser(opponentId, userId, status)
        if (status == WAITING_FOR_CONFIRMATION) {
            opponentNotificationService.notifyOpponentLinked(opponentId, userId)
        }
    }

    fun findOpponentsLinkedWithRealUsers(): List<OpponentDto> =
        linkedOpponentDao.findOpponentsLinkedWithRealUsers(currentUserService.currentUserId())

    fun userAlreadyLinked(userName: String): Boolean =
        linkedOpponentDao.userAlreadyLinked(userName, currentUserService.currentUserId())

    fun removeLinkedUser(opponentId: Id) {
        log.info("About to remove linked opponent[$opponentId]")
        linkedOpponentDao.removeLinkedUser(opponentId)
    }

    fun acceptLinking(request: AcceptOpponentLinkedRequest) {
        val notification = opponentNotificationService.findNotificationData(request.notificationId)
        linkWithUser(notification.linkedOpponentId, currentUserService.currentUserId(), ENABLED)
        opponentNotificationService.finishLinkingOpponent(request.notificationId)
    }
}
