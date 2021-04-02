package com.grudus.planshboard.boardgames.model

import com.grudus.planshboard.opponents.model.OpponentDto

data class LinkedBoardGame(
    val game: BoardGame,
    val creator: OpponentDto,
    val hidden: Boolean
)
