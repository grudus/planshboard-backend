package com.grudus.planshboard.opponents.model

import com.grudus.planshboard.commons.Id
import java.time.LocalDateTime

data class Opponent (
    val id: Id? = null,
    val name: String,
    val creatorId: Id,
    val createdAt: LocalDateTime,
    val linkedTo: Id? = null
)
