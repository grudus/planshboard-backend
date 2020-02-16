package com.grudus.planshboard.commons.responses

import com.grudus.planshboard.commons.Id

data class IdResponse(val id: Id)

fun idOf(id: Id) = IdResponse(id)
