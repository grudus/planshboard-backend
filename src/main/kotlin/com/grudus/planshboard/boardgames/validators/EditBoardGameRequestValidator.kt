package com.grudus.planshboard.boardgames.validators

import com.grudus.planshboard.boardgames.model.EditBoardGameRequest
import com.grudus.planshboard.commons.validation.ValidationResult
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

@Component
class EditBoardGameRequestValidator
@Autowired
constructor(private val boardGameNameValidator: BoardGameNameValidator) {

    fun validate(request: EditBoardGameRequest): ValidationResult =
        boardGameNameValidator.validate(request.name)
}

