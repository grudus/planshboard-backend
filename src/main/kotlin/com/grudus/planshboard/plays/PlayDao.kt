package com.grudus.planshboard.plays

import com.grudus.planshboard.commons.CurrentTimeProvider
import com.grudus.planshboard.commons.Id
import com.grudus.planshboard.commons.exceptions.CannotFetchAfterInsertException
import com.grudus.planshboard.commons.security.AccessToResourceChecker
import com.grudus.planshboard.enums.FinalResult
import com.grudus.planshboard.enums.LinkedOpponentStatus
import com.grudus.planshboard.enums.LinkedOpponentStatus.ENABLED
import com.grudus.planshboard.plays.model.PlayListItem
import com.grudus.planshboard.plays.model.PlayResult
import com.grudus.planshboard.plays.model.SavePlayRequest
import com.grudus.planshboard.tables.BoardGames.BOARD_GAMES
import com.grudus.planshboard.tables.LinkedOpponents.LINKED_OPPONENTS
import com.grudus.planshboard.tables.Opponents.OPPONENTS
import com.grudus.planshboard.tables.PlayResults.PLAY_RESULTS
import com.grudus.planshboard.tables.Plays.PLAYS
import org.jooq.DSLContext
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Repository
import java.time.LocalDateTime

@Repository
class PlayDao
@Autowired
constructor(
    private val dsl: DSLContext,
    private val currentTimeProvider: CurrentTimeProvider
) : AccessToResourceChecker {

    fun savePlayAlone(request: SavePlayRequest): Id =
        dsl.insertInto(PLAYS)
            .set(PLAYS.BOARD_GAME_ID, request.boardGameId)
            .set(PLAYS.CREATED_AT, currentTimeProvider.now())
            .set(PLAYS.DATE, request.date)
            .set(PLAYS.NOTE, request.note)
            .set(PLAYS.FINAL_RESULT, request.finalResult?.name?.let { FinalResult.valueOf(it) })
            .returning()
            .fetchOne()
            ?.id ?: throw CannotFetchAfterInsertException()

    fun updatePlayAlone(playId: Id, date: LocalDateTime?, note: String?) {
        dsl.update(PLAYS)
            .set(PLAYS.DATE, date)
            .set(PLAYS.NOTE, note)
            .where(PLAYS.ID.eq(playId))
            .execute()
    }

    fun savePlayResults(playId: Long, results: List<PlayResult>) {
        val batch = dsl.batch(
            dsl.insertInto(
                PLAY_RESULTS,
                PLAY_RESULTS.PLAY_ID,
                PLAY_RESULTS.OPPONENT_ID,
                PLAY_RESULTS.POSITION,
                PLAY_RESULTS.POINTS
            )
                .values(null as Long?, null, null, null)
        )
        results.forEach { result ->
            batch.bind(playId, result.opponentId, result.position, result.points)
        }
        batch.execute()
    }

    override fun canBeAccessedByUser(userId: Id, entityIds: List<Id>): Boolean =
        dsl.fetchCount(
            dsl.select(PLAYS.ID)
                .from(PLAYS)
                .join(BOARD_GAMES).on(BOARD_GAMES.ID.eq(PLAYS.BOARD_GAME_ID))
                .where(PLAYS.ID.`in`(entityIds))
                .and(BOARD_GAMES.CREATOR_ID.eq(userId))
        ) == entityIds.size

    fun removePlayResults(playId: Id) {
        dsl.deleteFrom(PLAY_RESULTS)
            .where(PLAY_RESULTS.PLAY_ID.eq(playId))
            .execute()
    }

    fun getPlays(userId: Id): List<PlayListItem> =
        dsl.select(PLAYS.ID, PLAYS.BOARD_GAME_ID)
            .from(PLAYS)
            .join(BOARD_GAMES).on(BOARD_GAMES.ID.eq(PLAYS.BOARD_GAME_ID))
            .where(BOARD_GAMES.CREATOR_ID.eq(userId))
            .fetchInto(PlayListItem::class.java)


    fun userParticipatedInPlay(userId: Id, playId: Id): Boolean =
        dsl.fetchExists(
            dsl.select(PLAYS.ID)
                .from(PLAYS)
                .join(PLAY_RESULTS).on(PLAY_RESULTS.PLAY_ID.eq(PLAYS.ID))
                .join(LINKED_OPPONENTS).on(LINKED_OPPONENTS.OPPONENT_ID.eq(PLAY_RESULTS.OPPONENT_ID))
                .where(PLAYS.ID.eq(playId))
                .and(LINKED_OPPONENTS.LINKED_USER_ID.eq(userId))
                .and(LINKED_OPPONENTS.INTEGRATION_STATUS.eq(ENABLED))
        )
}
