package com.grudus.planshboard.plays.model

import com.grudus.planshboard.commons.Id
import java.time.LocalDateTime

data class SinglePlay(
    val id: Id,
    val boardGameId: Id,
    val results: List<PlayResult>,
    val tags: List<String>,
    val date: LocalDateTime? = null,
    val note: String? = null,
    val finalResult: FinalResult? = null
)
