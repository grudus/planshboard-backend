package com.grudus.planshboard.opponents.model

import com.grudus.planshboard.commons.responses.NameCount

data class OpponentStats(
    val numberOfPlays: Int,
    val numberOfWins: Int,
    val lastPlayedBoardGame: String?,
    val mostPlayedBoardGame: NameCount?,
    val mostWinsBoardGame: NameCount?
)
