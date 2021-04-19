package com.grudus.planshboard.opponents.linked

import com.grudus.planshboard.commons.Id
import com.grudus.planshboard.opponents.OpponentDaoHelper
import com.grudus.planshboard.opponents.model.LinkedOpponentStatus
import com.grudus.planshboard.opponents.model.OpponentDto
import com.grudus.planshboard.tables.LinkedOpponents
import com.grudus.planshboard.tables.LinkedOpponents.*
import com.grudus.planshboard.tables.Opponents
import com.grudus.planshboard.tables.Opponents.*
import com.grudus.planshboard.tables.Users
import com.grudus.planshboard.tables.Users.*
import org.jooq.DSLContext
import org.springframework.stereotype.Repository

@Repository
class LinkedOpponentDao
constructor(
    private val dsl: DSLContext,
    private val helper: OpponentDaoHelper
) {

    fun linkWithUser(
        opponentId: Id,
        linkedTo: Id,
        status: LinkedOpponentStatus = LinkedOpponentStatus.WAITING_FOR_CONFIRMATION
    ) {
        dsl.insertInto(LINKED_OPPONENTS)
            .set(LINKED_OPPONENTS.OPPONENT_ID, opponentId)
            .set(LINKED_OPPONENTS.LINKED_USER_ID, linkedTo)
            .set(LINKED_OPPONENTS.INTEGRATION_STATUS, helper.convert(status))
            .execute()
    }

    fun findOpponentsLinkedWithRealUsers(userId: Id): List<OpponentDto> =
        helper.selectOpponentWithLinkedUser()
            .where(OPPONENTS.CREATOR_ID.eq(userId))
            .and(LINKED_OPPONENTS.OPPONENT_ID.isNotNull)
            .and(LINKED_OPPONENTS.INTEGRATION_STATUS.eq(helper.convert(LinkedOpponentStatus.ENABLED)))
            .fetch(helper.opponentDtoMapper())


    fun userAlreadyLinked(userName: String, opponentCreatorId: Id): Boolean =
        dsl.fetchExists(
            dsl.select(OPPONENTS.ID)
                .from(OPPONENTS)
                .join(LINKED_OPPONENTS).on(LINKED_OPPONENTS.OPPONENT_ID.eq(OPPONENTS.ID))
                .join(USERS).on(USERS.ID.eq(LINKED_OPPONENTS.LINKED_USER_ID))
                .where(OPPONENTS.CREATOR_ID.eq(opponentCreatorId))
                .and(USERS.NAME.eq(userName))
        )


    fun removeLinkedUser(opponentId: Id) {
        dsl.deleteFrom(LINKED_OPPONENTS)
            .where(LINKED_OPPONENTS.OPPONENT_ID.eq(opponentId))
            .execute()
    }


}
