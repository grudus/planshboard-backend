package com.grudus.planshboard.notifications

import com.grudus.planshboard.commons.Id
import com.grudus.planshboard.commons.security.SecurityGuard
import com.grudus.planshboard.user.CurrentUserService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class NotificationSecurityService
@Autowired
constructor(currentUserService: CurrentUserService, notificationDao: NotificationDao) :
    SecurityGuard(currentUserService, notificationDao) {

    override fun formatMessage(userId: Id, resourceIds: List<Id>) =
        "User[$userId] has no access to the notifications: $resourceIds"
}
