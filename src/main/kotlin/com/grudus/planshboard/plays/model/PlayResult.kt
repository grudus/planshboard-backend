package com.grudus.planshboard.plays.model

import com.grudus.planshboard.commons.Id

data class PlayResult(
    val opponentId: Id,
    val points: Int? = null,
    val position: Int? = null
)
