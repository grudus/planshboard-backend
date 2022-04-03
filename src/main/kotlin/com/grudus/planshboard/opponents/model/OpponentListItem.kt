package com.grudus.planshboard.opponents.model

import com.grudus.planshboard.commons.Id

data class OpponentListItem(
    val id: Id,
    val name: String,
    val linkedUser: UserLinkedToOpponent?,
    val numberOfPlays: Int,
    val numberOfWins: Int,
    val lastPlayedBoardGame: String? = null
)
