package com.grudus.planshboard.boardgames.validators

import com.grudus.planshboard.boardgames.BoardGameService
import com.grudus.planshboard.commons.validation.ValidationError
import com.grudus.planshboard.commons.validation.ValidationKeys
import com.grudus.planshboard.commons.validation.ValidationResult
import com.grudus.planshboard.commons.validation.ValidationSuccess
import com.grudus.planshboard.user.CurrentUserService
import org.apache.commons.lang3.StringUtils
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

@Component
class BoardGameNameValidator
@Autowired
constructor(private val boardGameService: BoardGameService,
            private val currentUserService: CurrentUserService) {

    fun performValidation(name: String): ValidationResult =
        when {
            isEmptyName(name) -> ValidationError(ValidationKeys.EMPTY_FIELD)
            gameAlreadyExists(name) -> ValidationError(ValidationKeys.GAME_ALREADY_EXISTS)
            else -> ValidationSuccess
        }

    private fun gameAlreadyExists(name: String): Boolean =
        boardGameService.nameExists(currentUserService.currentUserId(), name)

    private fun isEmptyName(name: String): Boolean =
        StringUtils.isBlank(name)
}
