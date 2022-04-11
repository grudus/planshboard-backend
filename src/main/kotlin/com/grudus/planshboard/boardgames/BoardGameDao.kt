package com.grudus.planshboard.boardgames

import com.grudus.planshboard.boardgames.model.BoardGame
import com.grudus.planshboard.boardgames.model.SingleBoardGameResponse
import com.grudus.planshboard.boardgames.options.BoardGameOptionsDao.Companion.optionsFromRecord
import com.grudus.planshboard.commons.Id
import com.grudus.planshboard.commons.exceptions.CannotFetchAfterInsertException
import com.grudus.planshboard.tables.BoardGameOptions.BOARD_GAME_OPTIONS
import com.grudus.planshboard.tables.BoardGames.BOARD_GAMES
import org.jooq.DSLContext
import org.jooq.Record
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Repository

@Repository
class BoardGameDao
@Autowired
constructor(private val dsl: DSLContext) {

    fun findBoardGamesCreatedByUser(userId: Id): List<BoardGame> =
        dsl.selectFrom(BOARD_GAMES)
            .where(BOARD_GAMES.CREATOR_ID.eq(userId))
            .orderBy(BOARD_GAMES.NAME)
            .fetchInto(BoardGame::class.java)

    fun create(creatorId: Id, name: String): Id =
        dsl.insertInto(BOARD_GAMES)
            .set(BOARD_GAMES.CREATOR_ID, creatorId)
            .set(BOARD_GAMES.NAME, name)
            .returning()
            .fetchOne()
            ?.id ?: throw CannotFetchAfterInsertException()


    fun nameExists(userId: Id, name: String): Boolean =
        dsl.fetchExists(
            dsl.select()
                .from(BOARD_GAMES)
                .where(BOARD_GAMES.NAME.eq(name))
                .and(BOARD_GAMES.CREATOR_ID.eq(userId))
        )


    fun rename(boardGameId: Id, newName: String) =
        dsl.update(BOARD_GAMES)
            .set(BOARD_GAMES.NAME, newName)
            .where(BOARD_GAMES.ID.eq(boardGameId))
            .execute()


    fun isCreatedByUser(boardGameId: Id, userId: Id): Boolean =
        dsl.fetchExists(
            dsl.select()
                .from(BOARD_GAMES)
                .where(BOARD_GAMES.ID.eq(boardGameId))
                .and(BOARD_GAMES.CREATOR_ID.eq(userId))
        )

    fun findById(boardGameId: Id): BoardGame? =
        dsl.selectFrom(BOARD_GAMES)
            .where(BOARD_GAMES.ID.eq(boardGameId))
            .fetchOneInto(BoardGame::class.java)

    fun findWithOptions(boardGameId: Id): SingleBoardGameResponse? =
        dsl.select(BOARD_GAMES.fields().asList())
            .select(BOARD_GAME_OPTIONS.fields().asList())
            .from(BOARD_GAMES)
            .join(BOARD_GAME_OPTIONS).on(BOARD_GAMES.ID.eq(BOARD_GAME_OPTIONS.BOARD_GAME_ID))
            .where(BOARD_GAMES.ID.eq(boardGameId))
            .fetchOne { record ->
                SingleBoardGameResponse(gameFromRecord(record), optionsFromRecord(record))
            }

    fun remove(boardGameId: Id) {
        dsl.deleteFrom(BOARD_GAMES)
            .where(BOARD_GAMES.ID.eq(boardGameId))
            .execute()
    }

    companion object {
        fun gameFromRecord(record: Record): BoardGame =
            BoardGame(
                record[BOARD_GAMES.ID],
                record[BOARD_GAMES.NAME],
                record[BOARD_GAMES.CREATOR_ID],
                record[BOARD_GAMES.CREATED_AT]
            )

    }

}
