package com.grudus.planshboard.opponents.model

import com.grudus.planshboard.commons.Id

data class OpponentDto(val id: Id, val name: String, val linkedUser: UserLinkedToOpponent? = null)
