package com.grudus.planshboard.notifications.model

import com.grudus.planshboard.commons.Id

data class PlayNotification(
    val creatorId: Id,
    val creatorDisplayName: String,
    val playId: Id,
    val boardGameId: Id,
    val position: Int? = null,
    val points: Int? = null
) {

    enum class PossibleActions {
        ACCEPT,
        ACCEPT_ALL,
        REJECT,
    }
}
