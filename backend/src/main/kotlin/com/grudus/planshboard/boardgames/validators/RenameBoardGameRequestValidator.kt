package com.grudus.planshboard.boardgames.validators

import com.grudus.planshboard.boardgames.model.RenameBoardGameRequest
import com.grudus.planshboard.commons.validation.RequestValidator
import com.grudus.planshboard.commons.validation.ValidationResult
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

@Component
class RenameBoardGameRequestValidator
@Autowired
constructor(private val boardGameNameValidator: BoardGameNameValidator): RequestValidator<RenameBoardGameRequest>() {

    override fun performValidation(request: RenameBoardGameRequest): ValidationResult =
        boardGameNameValidator.performValidation(request.name)
}

