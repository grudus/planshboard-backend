package com.grudus.planshboard.boardgames

import com.grudus.planshboard.boardgames.model.BoardGame
import com.grudus.planshboard.commons.Id
import com.grudus.planshboard.tables.BoardGames.BOARD_GAMES
import com.grudus.planshboard.tables.LinkedBoardGames.LINKED_BOARD_GAMES
import org.jooq.DSLContext
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Repository

@Repository
class BoardGameDao
@Autowired
constructor(private val dsl: DSLContext) {

    fun findBoardGamesCreatedByUser(userId: Id): List<BoardGame> =
        dsl.selectFrom(BOARD_GAMES)
            .where(BOARD_GAMES.CREATOR_ID.eq(userId))
            .fetchInto(BoardGame::class.java)


    fun findBoardGamesLinkedFroUser(userId: Id): List<BoardGame> =
        dsl.selectFrom(BOARD_GAMES.join(LINKED_BOARD_GAMES).on(BOARD_GAMES.ID.eq(LINKED_BOARD_GAMES.BOARD_GAME_ID)))
            .where(LINKED_BOARD_GAMES.LINKED_USER_ID.eq(userId))
            .and(LINKED_BOARD_GAMES.HIDDEN.isFalse)
            .fetchInto(BoardGame::class.java)


    fun create(creatorId: Id, name: String): Id =
        dsl.insertInto(BOARD_GAMES)
            .set(BOARD_GAMES.CREATOR_ID, creatorId)
            .set(BOARD_GAMES.NAME, name)
            .returning()
            .fetchOne()
            .id


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

    fun remove(boardGameId: Id) {
        dsl.deleteFrom(BOARD_GAMES)
            .where(BOARD_GAMES.ID.eq(boardGameId))
            .execute()
    }

}
