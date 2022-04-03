package com.grudus.planshboard.boardgames

import com.grudus.planshboard.commons.Id
import com.grudus.planshboard.commons.exceptions.UserHasNoAccessToResourceException
import com.grudus.planshboard.user.CurrentUserService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class BoardGameSecurityService
@Autowired
constructor(private val boardGameDao: BoardGameDao,
            private val currentUserService: CurrentUserService) {

    fun checkAccess(boardGameId: Id) {
        val currentUserId = currentUserService.currentUserId()
        val hasAccess = boardGameDao.isCreatedByUser(boardGameId, currentUserId)
        if (!hasAccess)
            throw UserHasNoAccessToResourceException("User $currentUserId has no access to board game $boardGameId")
    }

}
