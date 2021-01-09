package com.grudus.planshboard.commons.security

import com.grudus.planshboard.commons.Id

interface AccessToResourceChecker {
    fun canBeAccessedByUser(userId: Id, entityIds: List<Id>): Boolean
}
