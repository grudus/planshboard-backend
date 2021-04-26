package com.grudus.planshboard.notifications.model

import com.grudus.planshboard.commons.Id

data class OpponentLinkedNotification(
    val creatorId: Id,
    val creatorDisplayName: String,
    val linkedOpponentId: Id
)
