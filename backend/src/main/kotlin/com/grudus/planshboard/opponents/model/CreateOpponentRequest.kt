package com.grudus.planshboard.opponents.model

data class CreateOpponentRequest(val opponentName: String, val existingUserName: String? = null)
