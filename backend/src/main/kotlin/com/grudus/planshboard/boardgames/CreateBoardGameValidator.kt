package com.grudus.planshboard.boardgames

import com.grudus.planshboard.boardgames.model.CreateBoardGameRequest
import com.grudus.planshboard.commons.validation.*
import com.grudus.planshboard.user.CurrentUserService
import org.apache.commons.lang3.StringUtils
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

@Component
class CreateBoardGameValidator
@Autowired
constructor(private val boardGameService: BoardGameService,
            private val currentUserService: CurrentUserService) : RequestValidator<CreateBoardGameRequest>() {

    override fun performValidation(request: CreateBoardGameRequest): ValidationResult =
        when {
            isEmptyName(request) -> ValidationError(ValidationKeys.EMPTY_FIELD)
            gameAlreadyExists(request) -> ValidationError(ValidationKeys.GAME_ALREADY_EXISTS)
            else -> ValidationSuccess
        }

    private fun gameAlreadyExists(request: CreateBoardGameRequest): Boolean =
        boardGameService.nameExists(currentUserService.currentUserId(), request.name)

    private fun isEmptyName(request: CreateBoardGameRequest): Boolean =
        StringUtils.isBlank(request.name)
}
