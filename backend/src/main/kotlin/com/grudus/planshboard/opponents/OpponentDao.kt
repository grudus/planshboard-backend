package com.grudus.planshboard.opponents

import com.grudus.planshboard.commons.CurrentTimeProvider
import com.grudus.planshboard.commons.Id
import com.grudus.planshboard.commons.security.AccessToResourceChecker
import com.grudus.planshboard.opponents.model.LinkedOpponentStatus
import com.grudus.planshboard.opponents.model.LinkedOpponentStatus.*
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
constructor(
    private val dsl: DSLContext,
    private val helper: OpponentDaoHelper,
    private val currentTimeProvider: CurrentTimeProvider
) : AccessToResourceChecker {

    fun creteInitial(name: String, userId: Id): Id =
        createAndLinkToUser(name, userId, userId, LINKED_WITH_CREATOR)

    // TODO mocked until plays implemented
    fun findListItems(userId: Id): List<OpponentListItem> =
        helper.selectOpponentWithLinkedUser()
            .where(OPPONENTS.CREATOR_ID.eq(userId))
            .orderBy(OPPONENTS.ID)
            .fetch { (id, opponentName, userId, userName, status) ->
                val linked = userId?.let { UserLinkedToOpponent(userId, userName, helper.convert(status)) }
                OpponentListItem(id, opponentName, linked, 0, 0)
            }

    fun findById(opponentId: Id): OpponentDto? =
        helper.selectOpponentWithLinkedUser()
            .where(OPPONENTS.ID.eq(opponentId))
            .fetchOne(helper.opponentDtoMapper())

    fun findOpponentsLinkedWithRealUsers(userId: Id): List<OpponentDto> =
        helper.selectOpponentWithLinkedUser()
            .where(OPPONENTS.CREATOR_ID.eq(userId))
            .and(LINKED_OPPONENTS.OPPONENT_ID.isNotNull)
            .and(LINKED_OPPONENTS.INTEGRATION_STATUS.eq(helper.convert(ENABLED)))
            .fetch(helper.opponentDtoMapper())


    fun createNew(name: String, userId: Id): Id =
        dsl.insertInto(OPPONENTS)
            .set(OPPONENTS.NAME, name)
            .set(OPPONENTS.CREATOR_ID, userId)
            .set(OPPONENTS.CREATED_AT, currentTimeProvider.now())
            .returning()
            .fetchOne()
            .id


    fun createAndLinkToUser(
        name: String,
        creatorId: Id,
        linkedTo: Id,
        status: LinkedOpponentStatus = WAITING_FOR_CONFIRMATION
    ): Id {
        val opponentId = dsl.insertInto(OPPONENTS)
            .set(OPPONENTS.NAME, name)
            .set(OPPONENTS.CREATOR_ID, creatorId)
            .set(OPPONENTS.CREATED_AT, currentTimeProvider.now())
            .returning()
            .fetchOne()
            .id

        dsl.insertInto(LINKED_OPPONENTS)
            .set(LINKED_OPPONENTS.OPPONENT_ID, opponentId)
            .set(LINKED_OPPONENTS.LINKED_USER_ID, linkedTo)
            .set(LINKED_OPPONENTS.INTEGRATION_STATUS, helper.convert(status))
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
            .set(LINKED_OPPONENTS.INTEGRATION_STATUS, helper.convert(status))
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

    override fun canBeAccessedByUser(userId: Id, entityIds: List<Id>): Boolean =
        dsl.fetchCount(
            dsl.select(OPPONENTS.ID)
                .from(OPPONENTS)
                .where(OPPONENTS.CREATOR_ID.eq(userId))
                .and(OPPONENTS.ID.`in`(entityIds))
        ) == entityIds.size
}
