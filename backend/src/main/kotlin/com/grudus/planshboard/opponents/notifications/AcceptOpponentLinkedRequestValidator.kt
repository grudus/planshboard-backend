package com.grudus.planshboard.opponents.notifications

import com.grudus.planshboard.commons.Id
import com.grudus.planshboard.commons.validation.ValidationError
import com.grudus.planshboard.commons.validation.ValidationKeys
import com.grudus.planshboard.commons.validation.ValidationResult
import com.grudus.planshboard.commons.validation.ValidationSuccess
import com.grudus.planshboard.notifications.NotificationService
import com.grudus.planshboard.notifications.model.OpponentLinkedNotification
import com.grudus.planshboard.opponents.OpponentService
import com.grudus.planshboard.opponents.model.LinkedOpponentStatus.WAITING_FOR_CONFIRMATION
import com.grudus.planshboard.user.CurrentUserService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

@Component
class AcceptOpponentLinkedRequestValidator
@Autowired
constructor(
    private val notificationService: NotificationService,
    private val opponentService: OpponentService,
    private val currentUserService: CurrentUserService
) {

    fun validate(request: AcceptOpponentLinkedRequest): ValidationResult =
        when {
            userCannotBeLinked(request.notificationId) -> ValidationError(ValidationKeys.CANNOT_BE_LINKED)
            else -> ValidationSuccess
        }

    private fun userCannotBeLinked(notificationId: Id): Boolean {
        val notification =
            notificationService.findNotificationData(notificationId, OpponentLinkedNotification::class.java)
                ?: return true
        val linkedUser = opponentService.findById(notification.linkedOpponentId)?.linkedUser ?: return true
        val currentUserId = currentUserService.currentUserId()

        return !(linkedUser.userId == currentUserId && linkedUser.status == WAITING_FOR_CONFIRMATION)
    }
}
