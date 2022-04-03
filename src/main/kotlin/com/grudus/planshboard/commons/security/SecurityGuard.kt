package com.grudus.planshboard.commons.security

import com.grudus.planshboard.commons.Id
import com.grudus.planshboard.user.CurrentUserService

abstract class SecurityGuard
constructor(
    private val currentUserService: CurrentUserService,
    private val accessToResourceChecker: AccessToResourceChecker
) {

    open fun checkAccess(resourceId: Id): SecurityCheckResult {
        return checkAccess(listOf(resourceId))
    }

    open fun checkAccess(resourceIds: List<Id>): SecurityCheckResult {
        val currentUserId = currentUserService.currentUserId()
        val hasAccess = accessToResourceChecker.canBeAccessedByUser(currentUserId, resourceIds)
        return if (hasAccess) AccessAllowed else AccessForbidden(formatMessage(currentUserId, resourceIds))
    }

    open fun formatMessage(userId: Id, resourceIds: List<Id>): String =
        "User[$userId] has no access to the resources: $resourceIds"
}
