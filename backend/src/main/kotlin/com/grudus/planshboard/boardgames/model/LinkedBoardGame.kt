package com.grudus.planshboard.boardgames.model

import com.grudus.planshboard.commons.Id
import com.grudus.planshboard.opponents.model.OpponentDto

data class LinkedBoardGame(
    val creatorBoardGame: BoardGame,
    val creator: OpponentDto,
    val hidden: Boolean,
    val mergedBoardGameId: Id? = null
)
