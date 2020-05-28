package com.grudus.planshboard.plays

import com.grudus.planshboard.commons.CurrentTimeProvider
import com.grudus.planshboard.commons.Id
import com.grudus.planshboard.plays.model.PlayResult
import com.grudus.planshboard.plays.model.SavePlayRequest
import com.grudus.planshboard.tables.BoardGames.BOARD_GAMES
import com.grudus.planshboard.tables.PlayResults.PLAY_RESULTS
import com.grudus.planshboard.tables.Plays.PLAYS
import org.jooq.DSLContext
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Repository
import java.time.LocalDateTime

@Repository
class PlayDao
@Autowired
constructor(private val dsl: DSLContext,
            private val currentTimeProvider: CurrentTimeProvider) {

    fun savePlayAlone(request: SavePlayRequest): Id =
        dsl.insertInto(PLAYS)
            .set(PLAYS.BOARD_GAME_ID, request.boardGameId)
            .set(PLAYS.CREATED_AT, currentTimeProvider.now())
            .set(PLAYS.DATE, request.date)
            .set(PLAYS.NOTE, request.note)
            .returning()
            .fetchOne()
            .id!!

    fun updatePlayAlone(playId: Id, date: LocalDateTime?, note: String?) {
        dsl.update(PLAYS)
            .set(PLAYS.DATE, date)
            .set(PLAYS.NOTE, note)
            .where(PLAYS.ID.eq(playId))
            .execute()
    }

    fun savePlayResults(playId: Long, results: List<PlayResult>) {
        val batch = dsl.batch(
            dsl.insertInto(PLAY_RESULTS, PLAY_RESULTS.PLAY_ID, PLAY_RESULTS.OPPONENT_ID, PLAY_RESULTS.POSITION, PLAY_RESULTS.POINTS)
                .values(null as Long?, null, null, null)
        )
        results.forEach { result ->
            batch.bind(playId, result.opponentId, result.position, result.points)
        }
        batch.execute()
    }

    fun isCreatedByUser(playId: Id, creatorId: Id): Boolean =
        dsl.fetchExists(
            dsl.select(PLAYS.ID)
                .from(PLAYS)
                .join(BOARD_GAMES).on(BOARD_GAMES.ID.eq(PLAYS.BOARD_GAME_ID))
                .where(PLAYS.ID.eq(playId))
                .and(BOARD_GAMES.CREATOR_ID.eq(creatorId))
        )

    fun removePlayResults(playId: Id) {
        dsl.deleteFrom(PLAY_RESULTS)
            .where(PLAY_RESULTS.PLAY_ID.eq(playId))
            .execute()
    }
}
