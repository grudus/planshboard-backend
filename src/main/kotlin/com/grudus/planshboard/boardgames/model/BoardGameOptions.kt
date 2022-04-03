package com.grudus.planshboard.boardgames.model

import com.grudus.planshboard.commons.Id

data class BoardGameOptions(
    val boardGameId: Id?,
    val gameType: BoardGameType,
    val showPoints: Boolean,
    val showPosition: Boolean,
    val showNote: Boolean,
    val showDate: Boolean,
    val showTags: Boolean
) {

    companion object {
        fun default(boardGameId: Id? = null, gameType: BoardGameType = BoardGameType.REGULAR): BoardGameOptions =
            BoardGameOptions(
                boardGameId,
                gameType,
                showPoints = true,
                showPosition = true,
                showNote = true,
                showDate = true,
                showTags = true
            )
    }
}
