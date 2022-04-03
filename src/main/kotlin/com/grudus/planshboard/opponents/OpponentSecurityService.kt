package com.grudus.planshboard.opponents

import com.grudus.planshboard.commons.Id
import com.grudus.planshboard.commons.security.SecurityGuard
import com.grudus.planshboard.user.CurrentUserService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class OpponentSecurityService
@Autowired
constructor(
    opponentDao: OpponentDao,
    currentUserService: CurrentUserService
) : SecurityGuard(currentUserService, opponentDao) {

    override fun formatMessage(userId: Id, resourceIds: List<Id>) =
        "User $userId has no access to the opponents: $resourceIds"

}

