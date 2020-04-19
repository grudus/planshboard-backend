package com.grudus.planshboard.opponents

import com.grudus.planshboard.commons.Id
import com.grudus.planshboard.commons.exceptions.ResourceNotFoundException
import com.grudus.planshboard.opponents.model.*
import com.grudus.planshboard.user.CurrentUserService
import com.grudus.planshboard.user.UserService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class OpponentService
@Autowired
constructor(private val opponentDao: OpponentDao,
            private val userService: UserService,
            private val currentUserService: CurrentUserService) {

    fun createInitial(userName: String, userId: Id) {
        opponentDao.creteInitial(userName, userId)
    }

    fun findListItems(userId: Id): List<OpponentListItem> {
        return opponentDao.findListItems(userId)
    }

    // TODO mocked until plays implemented
    fun getWithStats(opponentId: Id, userId: Id): OpponentWithStats {
        val opponent: OpponentDto = opponentDao.findById(opponentId)
            ?: throw ResourceNotFoundException("Cannot find opponent[$opponentId]")

        val stats = OpponentStats(0, 0)
        return OpponentWithStats(opponent, stats)
    }

    fun create(request: CreateOpponentRequest, currentUserId: Id): Id {
        if (request.existingUserName == null) {
            return opponentDao.createNew(request.opponentName, currentUserId)
        }
        val userId = userService.findIdByName(request.existingUserName)
            ?: throw ResourceNotFoundException("Cannot find user[${request.existingUserName}]")

        return opponentDao.createAndLinkToUser(request.opponentName, currentUserId, userId)
    }

    fun existsForCurrentUser(name: String): Boolean =
        opponentDao.exists(name, currentUserService.currentUserId())

    fun userAlreadyLinked(existingUserName: String): Boolean =
        opponentDao.userAlreadyLinked(existingUserName, currentUserService.currentUserId())

}
