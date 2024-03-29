package com.grudus.planshboard.opponents.validators

import com.grudus.planshboard.commons.Id
import com.grudus.planshboard.commons.validation.ValidationError
import com.grudus.planshboard.commons.validation.ValidationKeys
import com.grudus.planshboard.commons.validation.ValidationResult
import com.grudus.planshboard.commons.validation.ValidationSuccess
import com.grudus.planshboard.opponents.OpponentService
import com.grudus.planshboard.opponents.linked.LinkedOpponentService
import com.grudus.planshboard.opponents.model.SaveOpponentRequest
import com.grudus.planshboard.opponents.model.OpponentDto
import com.grudus.planshboard.user.UserService
import org.apache.commons.lang3.StringUtils
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

@Component
class SaveOpponentRequestValidator
@Autowired
constructor(private val opponentService: OpponentService,
            private val linkedOpponentService: LinkedOpponentService,
            private val userService: UserService) {

    fun validate(request: SaveOpponentRequest, opponentId: Id? = null): ValidationResult {
        val oldOpponent: OpponentDto? = opponentId?.let { opponentService.findById(it) }
        val shouldCheckOpponentName = if (oldOpponent == null) true else oldOpponent.name != request.opponentName
        val shouldCheckLinkedUser = if (oldOpponent?.linkedUser == null) true else oldOpponent.linkedUser.userName != request.existingUserName

        return when {
            emptyFields(request) -> ValidationError(ValidationKeys.EMPTY_FIELD)
            shouldCheckOpponentName && opponentExists(request) -> ValidationError(ValidationKeys.OPPONENT_ALREADY_EXISTS)
            shouldCheckLinkedUser && existingUserDoesNotExists(request) -> ValidationError(ValidationKeys.UNKNOWN_USER)
            shouldCheckLinkedUser && userAlreadyLinked(request) -> ValidationError(ValidationKeys.USER_ALREADY_LINKED)
            else -> ValidationSuccess
        }
    }

    private fun userAlreadyLinked(request: SaveOpponentRequest): Boolean =
        if (!request.isLinkedToUser()) false
        else linkedOpponentService.userAlreadyLinked(request.existingUserName!!)

    private fun existingUserDoesNotExists(request: SaveOpponentRequest): Boolean =
        if (!request.isLinkedToUser()) false
        else userService.findIdByName(request.existingUserName!!) == null

    private fun opponentExists(request: SaveOpponentRequest): Boolean =
        opponentService.existsForCurrentUser(request.opponentName)


    private fun emptyFields(request: SaveOpponentRequest): Boolean =
        StringUtils.isBlank(request.opponentName)
}
