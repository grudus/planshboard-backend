package com.grudus.planshboard.opponents

import com.grudus.planshboard.commons.Id
import com.grudus.planshboard.opponents.model.LinkedOpponentStatus
import com.grudus.planshboard.opponents.model.LinkedOpponentStatus.LINKED_WITH_CREATOR
import com.grudus.planshboard.opponents.model.LinkedOpponentStatus.WAITING_FOR_CONFIRMATION
import com.grudus.planshboard.opponents.model.OpponentDto
import com.grudus.planshboard.opponents.model.OpponentListItem
import com.grudus.planshboard.opponents.model.UserLinkedToOpponent
import com.grudus.planshboard.tables.LinkedOpponents.LINKED_OPPONENTS
import com.grudus.planshboard.tables.Opponents.OPPONENTS
import com.grudus.planshboard.tables.Users.USERS
import org.jooq.DSLContext
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Repository

@Repository
class OpponentDao
@Autowired
constructor(private val dsl: DSLContext) {

    fun creteInitial(name: String, userId: Id): Id =
        createAndLinkToUser(name, userId, userId, LINKED_WITH_CREATOR)

    // TODO mocked until plays implemented
    fun findListItems(userId: Id): List<OpponentListItem> =
        dsl.select(OPPONENTS.ID, OPPONENTS.NAME, USERS.ID, USERS.NAME, LINKED_OPPONENTS.INTEGRATION_STATUS)
            .from(OPPONENTS)
            .leftJoin(LINKED_OPPONENTS).on(LINKED_OPPONENTS.OPPONENT_ID.eq(OPPONENTS.ID))
            .leftJoin(USERS).on(USERS.ID.eq(LINKED_OPPONENTS.LINKED_USER_ID))
            .where(OPPONENTS.CREATOR_ID.eq(userId))
            .fetch { (id, opponentName, userId, userName, status) ->
                val linked = userId?.let { UserLinkedToOpponent(userId, userName, convert(status)) }
                OpponentListItem(id, opponentName, linked, 0, 0)
            }

    fun findById(opponentId: Id): OpponentDto? =
        dsl.select(OPPONENTS.ID, OPPONENTS.NAME, USERS.ID, USERS.NAME, LINKED_OPPONENTS.INTEGRATION_STATUS)
            .from(OPPONENTS)
            .leftJoin(LINKED_OPPONENTS).on(LINKED_OPPONENTS.OPPONENT_ID.eq(OPPONENTS.ID))
            .leftJoin(USERS).on(USERS.ID.eq(LINKED_OPPONENTS.LINKED_USER_ID))
            .where(OPPONENTS.ID.eq(opponentId))
            .fetchOne { (id, opponentName, userId, userName, status) ->
                val linked = userId?.let { UserLinkedToOpponent(userId, userName, convert(status)) }
                OpponentDto(id, opponentName, linked)
            }


    fun createNew(name: String, userId: Id): Id =
        dsl.insertInto(OPPONENTS)
            .set(OPPONENTS.NAME, name)
            .set(OPPONENTS.CREATOR_ID, userId)
            .returning()
            .fetchOne()
            .id


    fun createAndLinkToUser(name: String, creatorId: Id, linkedTo: Id, status: LinkedOpponentStatus = WAITING_FOR_CONFIRMATION): Id {
        val opponentId = dsl.insertInto(OPPONENTS)
            .set(OPPONENTS.NAME, name)
            .set(OPPONENTS.CREATOR_ID, creatorId)
            .returning()
            .fetchOne()
            .id

        dsl.insertInto(LINKED_OPPONENTS)
            .set(LINKED_OPPONENTS.OPPONENT_ID, opponentId)
            .set(LINKED_OPPONENTS.LINKED_USER_ID, linkedTo)
            .set(LINKED_OPPONENTS.INTEGRATION_STATUS, convert(status))
            .execute()

        return opponentId
    }

    fun updateName(id: Id, name: String) {
        dsl.update(OPPONENTS)
            .set(OPPONENTS.NAME, name)
            .where(OPPONENTS.ID.eq(id))
            .execute()
    }

    fun removeLinkedUser(opponentId: Id) {
        dsl.deleteFrom(LINKED_OPPONENTS)
            .where(LINKED_OPPONENTS.OPPONENT_ID.eq(opponentId))
            .execute()
    }

    fun linkToUser(opponentId: Id, linkedTo: Id, status: LinkedOpponentStatus = WAITING_FOR_CONFIRMATION) {
        dsl.insertInto(LINKED_OPPONENTS)
            .set(LINKED_OPPONENTS.OPPONENT_ID, opponentId)
            .set(LINKED_OPPONENTS.LINKED_USER_ID, linkedTo)
            .set(LINKED_OPPONENTS.INTEGRATION_STATUS, convert(status))
            .execute()
    }

    fun exists(name: String, creatorId: Id): Boolean =
        dsl.fetchExists(
            dsl.select(OPPONENTS.ID)
                .from(OPPONENTS)
                .where(OPPONENTS.NAME.eq(name))
                .and(OPPONENTS.CREATOR_ID.eq(creatorId))
        )

    fun userAlreadyLinked(userName: String, opponentCreatorId: Id): Boolean =
        dsl.fetchExists(
            dsl.select(OPPONENTS.ID)
                .from(OPPONENTS)
                .join(LINKED_OPPONENTS).on(LINKED_OPPONENTS.OPPONENT_ID.eq(OPPONENTS.ID))
                .join(USERS).on(USERS.ID.eq(LINKED_OPPONENTS.LINKED_USER_ID))
                .where(OPPONENTS.CREATOR_ID.eq(opponentCreatorId))
                .and(USERS.NAME.eq(userName))
        )

    fun isCreatedByUser(opponentId: Id, creatorId: Id): Boolean =
        dsl.fetchExists(
            dsl.select(OPPONENTS.ID)
                .from(OPPONENTS)
                .where(OPPONENTS.CREATOR_ID.eq(creatorId))
                .and(OPPONENTS.ID.eq(opponentId))
        )

    private fun convert(status: LinkedOpponentStatus): com.grudus.planshboard.enums.LinkedOpponentStatus =
        com.grudus.planshboard.enums.LinkedOpponentStatus.valueOf(status.name)

    private fun convert(status: com.grudus.planshboard.enums.LinkedOpponentStatus): LinkedOpponentStatus  =
        LinkedOpponentStatus.valueOf(status.name)

}
