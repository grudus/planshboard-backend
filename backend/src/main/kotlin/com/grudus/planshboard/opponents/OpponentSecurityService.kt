package com.grudus.planshboard.opponents

import com.grudus.planshboard.commons.Id
import com.grudus.planshboard.commons.exceptions.UserHasNoAccessToResourceException
import com.grudus.planshboard.user.CurrentUserService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class OpponentSecurityService

@Autowired
constructor(private val opponentDao: OpponentDao,
            private val currentUserService: CurrentUserService) {

    fun checkAccess(opponentId: Id) {
        val currentUserId = currentUserService.currentUserId()
        val hasAccess = opponentDao.isCreatedByUser(opponentId, currentUserId)
        if (!hasAccess)
            throw UserHasNoAccessToResourceException("User $currentUserId has no access to the opponent $opponentId")
    }

    fun checkAccessForMultipleOpponents(opponentIds: List<Id>) {
        val currentUserId = currentUserService.currentUserId()
        val hasAccessForEach = opponentDao.areAllCreatedByUser(opponentIds, currentUserId)
        if (!hasAccessForEach)
            throw UserHasNoAccessToResourceException("User $currentUserId has no access to the opponents $opponentIds")
    }
}

