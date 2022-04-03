package com.grudus.planshboard.plays

import com.grudus.planshboard.commons.Id
import com.grudus.planshboard.commons.security.SecurityGuard
import com.grudus.planshboard.user.CurrentUserService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service


@Service
class PlaySecurityService
@Autowired
constructor(
    playDao: PlayDao,
    currentUserService: CurrentUserService
) : SecurityGuard(currentUserService, playDao) {

    override fun formatMessage(userId: Id, resourceIds: List<Id>) =
        "User $userId has no access to the plays: $resourceIds"

}
