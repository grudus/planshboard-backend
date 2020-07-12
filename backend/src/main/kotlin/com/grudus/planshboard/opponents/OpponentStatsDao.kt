package com.grudus.planshboard.opponents

import com.grudus.planshboard.commons.CurrentTimeProvider
import com.grudus.planshboard.commons.Id
import com.grudus.planshboard.opponents.model.LinkedOpponentStatus.ENABLED
import com.grudus.planshboard.opponents.model.LinkedOpponentStatus.LINKED_WITH_CREATOR
import com.grudus.planshboard.opponents.model.OpponentDto
import com.grudus.planshboard.tables.LinkedOpponents.LINKED_OPPONENTS
import com.grudus.planshboard.tables.Opponents.OPPONENTS
import com.grudus.planshboard.tables.PlayResults.PLAY_RESULTS
import com.grudus.planshboard.tables.Plays.PLAYS
import org.jooq.DSLContext
import org.jooq.impl.DSL
import org.jooq.impl.DSL.coalesce
import org.jooq.impl.DSL.count
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Repository

@Repository
class OpponentStatsDao
@Autowired
constructor(private val dsl: DSLContext,
            private val helper: OpponentDaoHelper) {

    fun findMostFrequentOpponents(userId: Id, limit: Int): List<OpponentDto> =
        helper.selectOpponentWithLinkedUser()
            .leftJoin(PLAY_RESULTS).on(PLAY_RESULTS.OPPONENT_ID.eq(OPPONENTS.ID))
            .where(OPPONENTS.CREATOR_ID.eq(userId)
                .and(coalesce(LINKED_OPPONENTS.INTEGRATION_STATUS, helper.convert(ENABLED)).notEqual(helper.convert(LINKED_WITH_CREATOR))))
            .groupBy(helper.opponentDtoFields)
            .orderBy(count(PLAY_RESULTS.OPPONENT_ID).desc(), OPPONENTS.CREATED_AT.desc())
            .limit(limit)
            .fetch(helper.opponentDtoMapper())


    fun findOpponentsWithMostRecentPlays(userId: Id, limit: Int): List<OpponentDto> =
        helper.selectOpponentWithLinkedUser()
            .join(PLAY_RESULTS).on(PLAY_RESULTS.OPPONENT_ID.eq(OPPONENTS.ID))
            .join(PLAYS).on(PLAY_RESULTS.PLAY_ID.eq(PLAYS.ID))
            .where(OPPONENTS.CREATOR_ID.eq(userId)
                .and(coalesce(LINKED_OPPONENTS.INTEGRATION_STATUS, helper.convert(ENABLED)).notEqual(helper.convert(LINKED_WITH_CREATOR))))
            .groupBy(helper.opponentDtoFields)
            .orderBy(DSL.max(PLAYS.CREATED_AT).desc(), DSL.max(OPPONENTS.CREATED_AT).desc())
            .limit(limit)
            .fetch(helper.opponentDtoMapper())
}
