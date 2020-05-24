package com.grudus.planshboard.plays.validators

import com.grudus.planshboard.boardgames.BoardGameSecurityService
import com.grudus.planshboard.commons.exceptions.UserHasNoAccessToResourceException
import com.grudus.planshboard.commons.validation.ValidationError
import com.grudus.planshboard.commons.validation.ValidationKeys
import com.grudus.planshboard.commons.validation.ValidationResult
import com.grudus.planshboard.commons.validation.ValidationSuccess
import com.grudus.planshboard.opponents.OpponentSecurityService
import com.grudus.planshboard.plays.model.CreatePlayRequest
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

@Component
class CreatePlayRequestValidator
@Autowired
constructor(private val boardGameSecurityService: BoardGameSecurityService,
            private val opponentSecurityService: OpponentSecurityService) {

    fun validate(request: CreatePlayRequest): ValidationResult =
        when {
            noResults(request) -> ValidationError(ValidationKeys.EMPTY_FIELD)
            positionOutOfRange(request) -> ValidationError(ValidationKeys.INVALID_POSITION)
            boardGameDoesNotExist(request) -> ValidationError(ValidationKeys.INVALID_BOARD_GAME)
            opponentsDoesNotExists(request) -> ValidationError(ValidationKeys.INVALID_OPPONENT)
            else -> ValidationSuccess
        }

    fun positionOutOfRange(request: CreatePlayRequest): Boolean {
        val results = request.results.size
        return request.results.all { (it.position ?: 0) > results || (it.position ?: 1) <= 0 }
    }


    private fun noResults(request: CreatePlayRequest): Boolean =
        request.results.isEmpty()

    private fun boardGameDoesNotExist(request: CreatePlayRequest): Boolean =
        try {
            boardGameSecurityService.checkAccess(request.boardGameId)
            false
        } catch (e: UserHasNoAccessToResourceException) {
            true
        }

    private fun opponentsDoesNotExists(request: CreatePlayRequest): Boolean =
        try {
            val opponentIds = request.results.map { it.opponentId }
            opponentSecurityService.checkAccessForMultipleOpponents(opponentIds)
            false
        } catch (e: UserHasNoAccessToResourceException) {
            true
        }
}
