package com.grudus.planshboard.plays

import com.grudus.planshboard.commons.CurrentTimeProvider
import com.grudus.planshboard.commons.Id
import com.grudus.planshboard.plays.model.CreatePlayRequest
import com.grudus.planshboard.plays.model.PlayResult
import com.grudus.planshboard.tables.PlayResults.PLAY_RESULTS
import com.grudus.planshboard.tables.Plays.PLAYS
import org.jooq.DSLContext
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Repository

@Repository
class PlayDao
@Autowired
constructor(private val dsl: DSLContext,
            private val currentTimeProvider: CurrentTimeProvider) {

    fun savePlayAlone(request: CreatePlayRequest): Id =
        dsl.insertInto(PLAYS)
            .set(PLAYS.BOARD_GAME_ID, request.boardGameId)
            .set(PLAYS.CREATED_AT, currentTimeProvider.now())
            .set(PLAYS.DATE, request.date)
            .set(PLAYS.NOTE, request.note)
            .returning()
            .fetchOne()
            .id!!

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


}
