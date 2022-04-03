package com.grudus.planshboard.plays.notifications

import com.grudus.planshboard.commons.Id

data class AcceptPlayParticipationRequest(
    val notificationId: Id,
    val acceptAllPendingFromCreator: Boolean = false
)
