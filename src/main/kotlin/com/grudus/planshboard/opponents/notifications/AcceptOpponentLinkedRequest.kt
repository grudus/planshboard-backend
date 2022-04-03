package com.grudus.planshboard.opponents.notifications

import com.grudus.planshboard.commons.Id

data class AcceptOpponentLinkedRequest(
    val notificationId: Id,
    val opponent: SelectedOpponent
)

data class SelectedOpponent(val newOpponentName: String? = null, val existingOpponentId: Id? = null)
