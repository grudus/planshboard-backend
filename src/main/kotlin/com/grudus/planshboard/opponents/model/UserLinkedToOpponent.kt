package com.grudus.planshboard.opponents.model

import com.grudus.planshboard.commons.Id

data class UserLinkedToOpponent(val userId: Id, val userName: String, val status: LinkedOpponentStatus)
