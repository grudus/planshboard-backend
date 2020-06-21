package com.grudus.planshboard.opponents

import com.grudus.planshboard.enums.LinkedOpponentStatus
import com.grudus.planshboard.opponents.model.OpponentDto
import com.grudus.planshboard.opponents.model.UserLinkedToOpponent
import com.grudus.planshboard.tables.LinkedOpponents
import com.grudus.planshboard.tables.Opponents
import com.grudus.planshboard.tables.Users
import org.jooq.DSLContext
import org.jooq.Record5
import org.jooq.SelectOnConditionStep
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

@Component
class OpponentDaoHelper
@Autowired
constructor(private val dsl: DSLContext) {
    val opponentDtoFields = listOf(Opponents.OPPONENTS.ID, Opponents.OPPONENTS.NAME, Users.USERS.ID, Users.USERS.NAME, LinkedOpponents.LINKED_OPPONENTS.INTEGRATION_STATUS)

    @Suppress("UNCHECKED_CAST") // We need to cast Record to Record5 to be able to use `opponentDtoFields`
    fun selectOpponentWithLinkedUser(): SelectOnConditionStep<Record5<Long, String, Long, String, LinkedOpponentStatus>> {
        return dsl.select(opponentDtoFields)
            .from(Opponents.OPPONENTS)
            .leftJoin(LinkedOpponents.LINKED_OPPONENTS).on(LinkedOpponents.LINKED_OPPONENTS.OPPONENT_ID.eq(Opponents.OPPONENTS.ID))
            .leftJoin(Users.USERS).on(Users.USERS.ID.eq(LinkedOpponents.LINKED_OPPONENTS.LINKED_USER_ID)) as SelectOnConditionStep<Record5<Long, String, Long, String, LinkedOpponentStatus>>
    }

    fun opponentDtoMapper(): (Record5<Long, String, Long, String, com.grudus.planshboard.enums.LinkedOpponentStatus>) -> OpponentDto {
        return { (id, opponentName, userId, userName, status) ->
            val linked = userId?.let { UserLinkedToOpponent(userId, userName, convert(status)) }
            OpponentDto(id, opponentName, linked)
        }
    }



    @Suppress("RemoveRedundantQualifierName")
    fun convert(status: com.grudus.planshboard.opponents.model.LinkedOpponentStatus): com.grudus.planshboard.enums.LinkedOpponentStatus =
        com.grudus.planshboard.enums.LinkedOpponentStatus.valueOf(status.name)

    @Suppress("RemoveRedundantQualifierName")
    fun convert(status: com.grudus.planshboard.enums.LinkedOpponentStatus): com.grudus.planshboard.opponents.model.LinkedOpponentStatus =
        com.grudus.planshboard.opponents.model.LinkedOpponentStatus.valueOf(status.name)


}
