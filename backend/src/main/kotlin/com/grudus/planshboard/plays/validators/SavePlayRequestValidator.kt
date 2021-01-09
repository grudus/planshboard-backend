package com.grudus.planshboard.plays.validators

import com.grudus.planshboard.boardgames.BoardGameSecurityService
import com.grudus.planshboard.commons.exceptions.UserHasNoAccessToResourceException
import com.grudus.planshboard.commons.validation.ValidationError
import com.grudus.planshboard.commons.validation.ValidationKeys
import com.grudus.planshboard.commons.validation.ValidationResult
import com.grudus.planshboard.commons.validation.ValidationSuccess
import com.grudus.planshboard.opponents.OpponentSecurityService
import com.grudus.planshboard.plays.model.SavePlayRequest
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

@Component
class SavePlayRequestValidator
@Autowired
constructor(
    private val boardGameSecurityService: BoardGameSecurityService,
    private val opponentSecurityService: OpponentSecurityService
) {

    fun validate(request: SavePlayRequest): ValidationResult =
        when {
            noResults(request) -> ValidationError(ValidationKeys.EMPTY_FIELD)
            positionOutOfRange(request) -> ValidationError(ValidationKeys.INVALID_POSITION)
            boardGameDoesNotExist(request) -> ValidationError(ValidationKeys.INVALID_BOARD_GAME)
            opponentsDoesNotExists(request) -> ValidationError(ValidationKeys.INVALID_OPPONENT)
            else -> ValidationSuccess
        }

    fun positionOutOfRange(request: SavePlayRequest): Boolean {
        val results = request.results.size
        return request.results.any { (it.position ?: 0) > results || (it.position ?: 1) <= 0 }
    }


    private fun noResults(request: SavePlayRequest): Boolean =
        request.results.isEmpty()

    private fun boardGameDoesNotExist(request: SavePlayRequest): Boolean =
        try {
            boardGameSecurityService.checkAccess(request.boardGameId)
            false
        } catch (e: UserHasNoAccessToResourceException) {
            true
        }

    private fun opponentsDoesNotExists(request: SavePlayRequest): Boolean {
        val opponentIds = request.results.map { it.opponentId }
        return !opponentSecurityService.checkAccess(opponentIds).hasAccess()
    }
}
