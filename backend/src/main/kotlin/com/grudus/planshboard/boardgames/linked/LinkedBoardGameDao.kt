package com.grudus.planshboard.boardgames.linked

import com.grudus.planshboard.boardgames.model.BoardGame
import com.grudus.planshboard.boardgames.model.LinkedBoardGame
import com.grudus.planshboard.commons.Id
import com.grudus.planshboard.enums.LinkedOpponentStatus
import com.grudus.planshboard.opponents.OpponentDaoHelper
import com.grudus.planshboard.opponents.model.OpponentDto
import com.grudus.planshboard.opponents.model.UserLinkedToOpponent
import com.grudus.planshboard.tables.BoardGames.BOARD_GAMES
import com.grudus.planshboard.tables.LinkedBoardGames.LINKED_BOARD_GAMES
import com.grudus.planshboard.tables.LinkedOpponents.LINKED_OPPONENTS
import com.grudus.planshboard.tables.Opponents.OPPONENTS
import com.grudus.planshboard.tables.Users.USERS
import org.jooq.DSLContext
import org.jooq.impl.DSL
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Repository

@Repository
class LinkedBoardGameDao
@Autowired
constructor(
    private val dsl: DSLContext,
    private val helper: OpponentDaoHelper
) {

    fun findBoardGamesLinkedWithUser(userId: Id, withHidden: Boolean = true): List<LinkedBoardGame> {
        val hiddenCondition = if (withHidden) DSL.noCondition() else LINKED_BOARD_GAMES.HIDDEN.isFalse

        return dsl.select(
            BOARD_GAMES.ID,
            BOARD_GAMES.NAME,
            BOARD_GAMES.CREATED_AT,
            BOARD_GAMES.CREATOR_ID,
            LINKED_BOARD_GAMES.HIDDEN,
            OPPONENTS.ID,
            OPPONENTS.NAME,
            USERS.ID,
            USERS.NAME,
            LINKED_OPPONENTS.INTEGRATION_STATUS
        ).from(LINKED_BOARD_GAMES)
            .join(BOARD_GAMES).on(BOARD_GAMES.ID.eq(LINKED_BOARD_GAMES.BOARD_GAME_ID))
            .join(USERS).on(USERS.ID.eq(BOARD_GAMES.CREATOR_ID))
            .join(LINKED_OPPONENTS).on(LINKED_OPPONENTS.LINKED_USER_ID.eq(BOARD_GAMES.CREATOR_ID))
            .join(OPPONENTS).on(OPPONENTS.ID.eq(LINKED_OPPONENTS.OPPONENT_ID))
            .where(OPPONENTS.CREATOR_ID.eq(userId))
            .and(LINKED_BOARD_GAMES.LINKED_USER_ID.eq(userId))
            .and(hiddenCondition)
            .and(LINKED_OPPONENTS.INTEGRATION_STATUS.eq(LinkedOpponentStatus.ENABLED))
            .fetch { record ->
                val game = BoardGame(
                    record[BOARD_GAMES.ID],
                    record[BOARD_GAMES.NAME],
                    record[BOARD_GAMES.CREATOR_ID],
                    record[BOARD_GAMES.CREATED_AT]
                )

                val opponent = OpponentDto(
                    record[OPPONENTS.ID],
                    record[OPPONENTS.NAME],
                    UserLinkedToOpponent(
                        record[USERS.ID],
                        record[USERS.NAME],
                        helper.convert(record[LINKED_OPPONENTS.INTEGRATION_STATUS])
                    )
                )

                return@fetch LinkedBoardGame(game, opponent, record[LINKED_BOARD_GAMES.HIDDEN])
            }

    }

    fun linkBoardGame(userId: Id, boardGameId: Id): Int {
        return dsl.insertInto(LINKED_BOARD_GAMES)
            .set(LINKED_BOARD_GAMES.LINKED_USER_ID, userId)
            .set(LINKED_BOARD_GAMES.BOARD_GAME_ID, boardGameId)
            .set(LINKED_BOARD_GAMES.HIDDEN, false)
            .onDuplicateKeyIgnore()
            .execute()
    }

}
