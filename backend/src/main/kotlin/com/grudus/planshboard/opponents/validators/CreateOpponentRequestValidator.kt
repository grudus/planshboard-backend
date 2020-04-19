package com.grudus.planshboard.opponents.validators

import com.grudus.planshboard.commons.validation.*
import com.grudus.planshboard.opponents.OpponentService
import com.grudus.planshboard.opponents.model.CreateOpponentRequest
import com.grudus.planshboard.user.UserService
import org.apache.commons.lang3.StringUtils
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

@Component
class CreateOpponentRequestValidator
@Autowired
constructor(private val opponentService: OpponentService,
            private val userService: UserService) : RequestValidator<CreateOpponentRequest>() {

    override fun performValidation(request: CreateOpponentRequest): ValidationResult =
        when {
            emptyFields(request) -> ValidationError(ValidationKeys.EMPTY_FIELD)
            opponentExists(request) -> ValidationError(ValidationKeys.OPPONENT_ALREADY_EXISTS)
            existingUserDoesNotExists(request) -> ValidationError(ValidationKeys.UNKNOWN_USER)
            userAlreadyLinked(request) -> ValidationError(ValidationKeys.USER_ALREADY_LINKED)
            else -> ValidationSuccess
        }

    private fun userAlreadyLinked(request: CreateOpponentRequest): Boolean =
        if (!request.isLinkedToUser()) false
        else opponentService.userAlreadyLinked(request.existingUserName!!)

    private fun existingUserDoesNotExists(request: CreateOpponentRequest): Boolean =
        if (!request.isLinkedToUser()) false
        else userService.findIdByName(request.existingUserName!!) == null

    private fun opponentExists(request: CreateOpponentRequest): Boolean =
        opponentService.existsForCurrentUser(request.opponentName)


    private fun emptyFields(request: CreateOpponentRequest): Boolean =
        StringUtils.isBlank(request.opponentName)
}
