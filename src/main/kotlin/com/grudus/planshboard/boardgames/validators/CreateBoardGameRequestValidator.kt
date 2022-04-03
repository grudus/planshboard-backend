package com.grudus.planshboard.boardgames.validators

import com.grudus.planshboard.boardgames.model.CreateBoardGameRequest
import com.grudus.planshboard.commons.validation.ValidationResult
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

@Component
class CreateBoardGameRequestValidator
@Autowired
constructor(private val boardGameNameValidator: BoardGameNameValidator) {

    fun validate(request: CreateBoardGameRequest): ValidationResult =
        boardGameNameValidator.validate(request.name)
}
