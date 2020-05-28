package com.grudus.planshboard.plays

import com.grudus.planshboard.commons.Id
import com.grudus.planshboard.commons.exceptions.UserHasNoAccessToResourceException
import com.grudus.planshboard.user.CurrentUserService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service


@Service
class PlaySecurityService
@Autowired
constructor(private val playDao: PlayDao,
            private val currentUserService: CurrentUserService) {

    fun checkAccess(playId: Id) {
        val currentUserId = currentUserService.currentUserId()
        val hasAccess = playDao.isCreatedByUser(playId, currentUserId)
        if (!hasAccess)
            throw UserHasNoAccessToResourceException("User $currentUserId has no access to the play $playId")
    }

}
