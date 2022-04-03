package com.grudus.planshboard.plays.notifications

import com.grudus.planshboard.commons.Id
import com.grudus.planshboard.commons.validation.ValidationError
import com.grudus.planshboard.commons.validation.ValidationKeys
import com.grudus.planshboard.commons.validation.ValidationResult
import com.grudus.planshboard.commons.validation.ValidationSuccess
import com.grudus.planshboard.notifications.NotificationService
import com.grudus.planshboard.notifications.model.PlayNotification
import com.grudus.planshboard.plays.PlayService
import com.grudus.planshboard.user.CurrentUserService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

@Component
class AcceptPlayParticipationRequestValidator
@Autowired
constructor(
    private val playService: PlayService,
    private val currentUserService: CurrentUserService,
    private val notificationService: NotificationService
) {

    fun validate(request: AcceptPlayParticipationRequest): ValidationResult =
        when {
            userCannotParticipleInPlay(request.notificationId) -> ValidationError(ValidationKeys.CANNOT_PARTICIPE_IN_PLAY)
            else -> ValidationSuccess
        }

    private fun userCannotParticipleInPlay(notificationId: Id): Boolean {
        val playNotification =
            notificationService.findNotificationData(notificationId, PlayNotification::class.java) ?: return true
        return !playService.userParticipatedInPlay(currentUserService.currentUserId(), playNotification.playId)
    }


}
