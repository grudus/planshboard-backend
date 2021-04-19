package com.grudus.planshboard.opponents

import com.grudus.planshboard.commons.CurrentTimeProvider
import com.grudus.planshboard.commons.Id
import com.grudus.planshboard.commons.security.AccessToResourceChecker
import com.grudus.planshboard.opponents.model.OpponentDto
import com.grudus.planshboard.opponents.model.OpponentListItem
import com.grudus.planshboard.opponents.model.UserLinkedToOpponent
import com.grudus.planshboard.tables.Opponents.OPPONENTS
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

    fun createNew(name: String, creatorId: Id): Id =
        dsl.insertInto(OPPONENTS)
            .set(OPPONENTS.NAME, name)
            .set(OPPONENTS.CREATOR_ID, creatorId)
            .set(OPPONENTS.CREATED_AT, currentTimeProvider.now())
            .returning()
            .fetchOne()
            .id


    fun updateName(id: Id, name: String) {
        dsl.update(OPPONENTS)
            .set(OPPONENTS.NAME, name)
            .where(OPPONENTS.ID.eq(id))
            .execute()
    }


    fun exists(name: String, creatorId: Id): Boolean =
        dsl.fetchExists(
            dsl.select(OPPONENTS.ID)
                .from(OPPONENTS)
                .where(OPPONENTS.NAME.eq(name))
                .and(OPPONENTS.CREATOR_ID.eq(creatorId))
        )

    override fun canBeAccessedByUser(userId: Id, entityIds: List<Id>): Boolean =
        dsl.fetchCount(
            dsl.select(OPPONENTS.ID)
                .from(OPPONENTS)
                .where(OPPONENTS.CREATOR_ID.eq(userId))
                .and(OPPONENTS.ID.`in`(entityIds))
        ) == entityIds.size
}
