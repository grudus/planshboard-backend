package com.grudus.planshboard.opponents.notifications

import com.grudus.planshboard.commons.Id
import com.grudus.planshboard.commons.validation.ValidationError
import com.grudus.planshboard.commons.validation.ValidationKeys
import com.grudus.planshboard.commons.validation.ValidationResult
import com.grudus.planshboard.commons.validation.ValidationSuccess
import com.grudus.planshboard.notifications.NotificationService
import com.grudus.planshboard.notifications.model.OpponentLinkedNotification
import com.grudus.planshboard.opponents.OpponentService
import com.grudus.planshboard.opponents.linked.LinkedOpponentService
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
    private val linkedOpponentService: LinkedOpponentService,
    private val currentUserService: CurrentUserService,
) {

    fun validate(request: AcceptOpponentLinkedRequest): ValidationResult {
        val (notificationId, opponent) = request;

        return when {
            userCannotBeLinked(notificationId) -> ValidationError(ValidationKeys.CANNOT_BE_LINKED)
            newOpponentAlreadyExists(opponent) -> ValidationError(ValidationKeys.OPPONENT_ALREADY_EXISTS)
            invalidExistingOpponent(opponent) -> ValidationError(ValidationKeys.INVALID_OPPONENT)
            else -> ValidationSuccess
        }
    }

    private fun userCannotBeLinked(notificationId: Id): Boolean {
        val notification =
            notificationService.findNotificationData(notificationId, OpponentLinkedNotification::class.java)
                ?: return true
        val linkedUser = opponentService.findById(notification.linkedOpponentId)?.linkedUser ?: return true
        val currentUserId = currentUserService.currentUserId()

        return !(linkedUser.userId == currentUserId && linkedUser.status == WAITING_FOR_CONFIRMATION)
    }

    private fun invalidExistingOpponent(opponent: SelectedOpponent): Boolean =
        if (opponent.existingOpponentId == null) false
        else !linkedOpponentService.canBeLinkedByCurrentUser(opponent.existingOpponentId)


    private fun newOpponentAlreadyExists(opponent: SelectedOpponent): Boolean =
        opponent.newOpponentName != null && opponentService.existsForCurrentUser(opponent.newOpponentName)

}
