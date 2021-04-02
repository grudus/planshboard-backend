package com.grudus.planshboard.notifications.model

import com.grudus.planshboard.commons.Id

data class MarkAsReadRequest(val ids: List<Id>) {
    constructor(id: Id) : this(listOf(id))
}
