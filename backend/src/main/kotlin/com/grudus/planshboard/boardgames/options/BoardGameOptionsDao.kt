package com.grudus.planshboard.boardgames.options

import com.grudus.planshboard.boardgames.model.BoardGameOptions
import com.grudus.planshboard.commons.Id
import com.grudus.planshboard.enums.BoardGameType
import com.grudus.planshboard.tables.BoardGameOptions.BOARD_GAME_OPTIONS
import org.jooq.DSLContext
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Repository

@Repository
class BoardGameOptionsDao
@Autowired
constructor(private val dsl: DSLContext) {

    fun createOptions(boardGameId: Id, options: BoardGameOptions) {
        dsl.insertInto(BOARD_GAME_OPTIONS)
            .set(BOARD_GAME_OPTIONS.BOARD_GAME_ID, boardGameId)
            .set(BOARD_GAME_OPTIONS.GAME_TYPE, convert(options.gameType))
            .set(BOARD_GAME_OPTIONS.SHOW_DATE, options.showDate)
            .set(BOARD_GAME_OPTIONS.SHOW_NOTE, options.showNote)
            .set(BOARD_GAME_OPTIONS.SHOW_POINTS, options.showPoints)
            .set(BOARD_GAME_OPTIONS.SHOW_POSITION, options.showPosition)
            .set(BOARD_GAME_OPTIONS.SHOW_TAGS, options.showTags)
    }

    fun updateOptions(boardGameId: Id, options: BoardGameOptions) {
        dsl.update(BOARD_GAME_OPTIONS)
            .set(BOARD_GAME_OPTIONS.GAME_TYPE, convert(options.gameType))
            .set(BOARD_GAME_OPTIONS.SHOW_DATE, options.showDate)
            .set(BOARD_GAME_OPTIONS.SHOW_NOTE, options.showNote)
            .set(BOARD_GAME_OPTIONS.SHOW_POINTS, options.showPoints)
            .set(BOARD_GAME_OPTIONS.SHOW_POSITION, options.showPosition)
            .set(BOARD_GAME_OPTIONS.SHOW_TAGS, options.showTags)
            .where(BOARD_GAME_OPTIONS.BOARD_GAME_ID.eq(boardGameId))
    }

    private fun convert(gameType: com.grudus.planshboard.boardgames.model.BoardGameType): BoardGameType =
        BoardGameType.valueOf(gameType.name)
}
