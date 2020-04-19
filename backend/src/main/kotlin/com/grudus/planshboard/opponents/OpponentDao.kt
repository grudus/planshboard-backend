package com.grudus.planshboard.opponents

import com.grudus.planshboard.commons.Id
import com.grudus.planshboard.enums.LinkedOpponentStatus
import com.grudus.planshboard.opponents.model.OpponentDto
import com.grudus.planshboard.opponents.model.OpponentListItem
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
        createAndLinkToUser(name, userId, userId)

    // TODO mocked until plays implemented
    fun findListItems(userId: Id): List<OpponentListItem> =
        dsl.select(OPPONENTS.ID, OPPONENTS.NAME, USERS.NAME)
            .from(OPPONENTS)
            .leftJoin(LINKED_OPPONENTS).on(LINKED_OPPONENTS.OPPONENT_ID.eq(OPPONENTS.ID))
            .leftJoin(USERS).on(USERS.ID.eq(LINKED_OPPONENTS.LINKED_USER_ID))
            .where(OPPONENTS.CREATOR_ID.eq(userId))
            .fetch {(id, opponentName, existingUserName) ->
                OpponentListItem(id, opponentName, existingUserName, 0, 0, null)
            }

    fun findById(opponentId: Id): OpponentDto? =
        dsl.select(OPPONENTS.ID, OPPONENTS.NAME, USERS.NAME.`as`("existingUserName"))
            .from(OPPONENTS)
            .leftJoin(LINKED_OPPONENTS).on(LINKED_OPPONENTS.OPPONENT_ID.eq(OPPONENTS.ID))
            .leftJoin(USERS).on(USERS.ID.eq(LINKED_OPPONENTS.LINKED_USER_ID))
            .where(OPPONENTS.ID.eq(opponentId))
            .fetchOneInto(OpponentDto::class.java)


    fun createNew(name: String, userId: Id): Id =
        dsl.insertInto(OPPONENTS)
            .set(OPPONENTS.NAME, name)
            .set(OPPONENTS.CREATOR_ID, userId)
            .returning()
            .fetchOne()
            .id


    fun createAndLinkToUser(name: String, creatorId: Id, linkedTo: Id): Id {
        val opponentId = dsl.insertInto(OPPONENTS)
            .set(OPPONENTS.NAME, name)
            .set(OPPONENTS.CREATOR_ID, creatorId)
            .returning()
            .fetchOne()
            .id

        dsl.insertInto(LINKED_OPPONENTS)
            .set(LINKED_OPPONENTS.OPPONENT_ID, opponentId)
            .set(LINKED_OPPONENTS.LINKED_USER_ID, linkedTo)
            .set(LINKED_OPPONENTS.INTEGRATION_STATUS, LinkedOpponentStatus.WAITING_FOR_CONFIRMATION)
            .execute()

        return opponentId
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

}
