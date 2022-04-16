package com.grudus.planshboard.plays

import com.grudus.planshboard.Tables.PLAY_TAGS
import com.grudus.planshboard.Tables.TAGS
import com.grudus.planshboard.commons.CurrentTimeProvider
import com.grudus.planshboard.commons.Id
import com.grudus.planshboard.commons.exceptions.CannotFetchAfterInsertException
import com.grudus.planshboard.commons.jooq.JooqCommons.parseJsonBArray
import com.grudus.planshboard.commons.security.AccessToResourceChecker
import com.grudus.planshboard.commons.utils.convert
import com.grudus.planshboard.enums.LinkedOpponentStatus.ENABLED
import com.grudus.planshboard.plays.model.FinalResult
import com.grudus.planshboard.plays.model.PlayResult
import com.grudus.planshboard.plays.model.SavePlayRequest
import com.grudus.planshboard.plays.model.SinglePlay
import com.grudus.planshboard.tables.BoardGames.BOARD_GAMES
import com.grudus.planshboard.tables.LinkedOpponents.LINKED_OPPONENTS
import com.grudus.planshboard.tables.PlayResults.PLAY_RESULTS
import com.grudus.planshboard.tables.Plays.PLAYS
import java.time.LocalDateTime
import org.jooq.DSLContext
import org.jooq.JSONB
import org.jooq.impl.DSL.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Repository

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
            .set(PLAYS.FINAL_RESULT, convert(request.finalResult, com.grudus.planshboard.enums.FinalResult::class.java))
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

    fun getPlays(userId: Id): List<SinglePlay> {
        val tagsAlias = field("tags", Array<String?>::class.java)
        val playResultsAlias = field("playResults", Array<JSONB>::class.java)

        return dsl.select(
            PLAYS.ID,
            max(PLAYS.BOARD_GAME_ID).`as`(PLAYS.BOARD_GAME_ID),
            max(PLAYS.DATE).`as`(PLAYS.DATE),
            max(PLAYS.NOTE).`as`(PLAYS.NOTE),
            max(PLAYS.FINAL_RESULT).`as`(PLAYS.FINAL_RESULT),
            arrayAggDistinct(
                jsonbObject(
                    key(PlayResult::opponentId.name).value(PLAY_RESULTS.OPPONENT_ID),
                    key(PlayResult::points.name).value(PLAY_RESULTS.POINTS),
                    key(PlayResult::position.name).value(PLAY_RESULTS.POSITION),
                )
            ).`as`(playResultsAlias),
            arrayAggDistinct(TAGS.NAME).`as`(tagsAlias)
        )
            .from(PLAYS)
            .join(BOARD_GAMES).on(BOARD_GAMES.ID.eq(PLAYS.BOARD_GAME_ID))
            .join(PLAY_RESULTS).on(PLAY_RESULTS.PLAY_ID.eq(PLAYS.ID))
            .leftJoin(PLAY_TAGS).on(PLAY_TAGS.PLAY_ID.eq(PLAYS.ID))
            .leftJoin(TAGS).on(TAGS.ID.eq(PLAY_TAGS.TAG_ID))
            .where(BOARD_GAMES.CREATOR_ID.eq(userId))
            .groupBy(PLAYS.ID)
            .orderBy(max(PLAYS.DATE).desc())
            .fetch { r ->
                val tags = r[tagsAlias].filterNotNull().filter { it != "null" }

                SinglePlay(
                    id = r[PLAYS.ID],
                    boardGameId = r[PLAYS.BOARD_GAME_ID],
                    results = parseJsonBArray(r, playResultsAlias, PlayResult::class.java),
                    tags = tags,
                    date = r[PLAYS.DATE],
                    note = r[PLAYS.NOTE],
                    finalResult = convert(r[PLAYS.FINAL_RESULT], FinalResult::class.java)
                )
            }
    }


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
