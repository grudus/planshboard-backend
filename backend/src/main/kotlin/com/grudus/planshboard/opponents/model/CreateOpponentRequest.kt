package com.grudus.planshboard.opponents.model

import org.apache.commons.lang3.StringUtils

data class CreateOpponentRequest(val opponentName: String, val existingUserName: String? = null) {

    fun isLinkedToUser(): Boolean = StringUtils.isNotBlank(existingUserName)
}
