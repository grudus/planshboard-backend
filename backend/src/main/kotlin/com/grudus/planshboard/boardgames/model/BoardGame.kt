package com.grudus.planshboard.boardgames.model

import com.grudus.planshboard.commons.Id
import java.time.LocalDateTime

data class BoardGame(
    val id: Id? = null,
    val name: String,
    val creatorId: Id,
    val createdAt: LocalDateTime
)
