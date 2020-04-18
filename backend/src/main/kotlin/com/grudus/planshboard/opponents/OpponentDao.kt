package com.grudus.planshboard.opponents

import com.grudus.planshboard.commons.Id
import com.grudus.planshboard.opponents.model.OpponentDto
import com.grudus.planshboard.opponents.model.OpponentListItem
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
            .join(USERS).on(USERS.ID.eq(OPPONENTS.LINKED_TO))
            .where(OPPONENTS.CREATOR_ID.eq(userId))
            .fetch {(id, opponentName, existingUserName) ->
                OpponentListItem(id, opponentName, existingUserName, 0, 0, null)
            }

    fun findById(opponentId: Id): OpponentDto? =
        dsl.select(OPPONENTS.ID, OPPONENTS.NAME, USERS.NAME.`as`("existingUserName"))
            .from(OPPONENTS)
            .leftJoin(USERS).on(USERS.ID.eq(OPPONENTS.LINKED_TO))
            .where(OPPONENTS.ID.eq(opponentId))
            .fetchOneInto(OpponentDto::class.java)


    fun createNew(name: String, userId: Id): Id =
        dsl.insertInto(OPPONENTS)
            .set(OPPONENTS.NAME, name)
            .set(OPPONENTS.CREATOR_ID, userId)
            .returning()
            .fetchOne()
            .id


    fun createAndLinkToUser(name: String, creatorId: Id, linkedTo: Id): Id =
        dsl.insertInto(OPPONENTS)
            .set(OPPONENTS.NAME, name)
            .set(OPPONENTS.CREATOR_ID, creatorId)
            .set(OPPONENTS.LINKED_TO, linkedTo)
            .returning()
            .fetchOne()
            .id

    fun exists(name: String, creatorId: Id): Boolean =
        dsl.fetchExists(
            dsl.select(OPPONENTS.ID)
                .from(OPPONENTS)
                .where(OPPONENTS.NAME.eq(name))
                .and(OPPONENTS.CREATOR_ID.eq(creatorId))
        )

}
