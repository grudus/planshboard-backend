package com.grudus.planshboard.opponents

import com.grudus.planshboard.commons.Id
import com.grudus.planshboard.commons.exceptions.ResourceNotFoundException
import com.grudus.planshboard.env.EnvironmentKeys.MAX_NUMBER_OF_FREQUENT_OPPONENTS
import com.grudus.planshboard.env.EnvironmentService
import com.grudus.planshboard.opponents.linked.LinkedOpponentService
import com.grudus.planshboard.opponents.model.*
import com.grudus.planshboard.opponents.model.LinkedOpponentStatus.WAITING_FOR_CONFIRMATION
import com.grudus.planshboard.user.CurrentUserService
import com.grudus.planshboard.user.UserService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class OpponentService
@Autowired
constructor(
    private val opponentDao: OpponentDao,
    private val linkedOpponentService: LinkedOpponentService,
    private val opponentStatsDao: OpponentStatsDao,
    private val userService: UserService,
    private val currentUserService: CurrentUserService,
    private val environmentService: EnvironmentService
) {

    fun createInitial(userName: String, userCreatorId: Id) {
        val opponentId = opponentDao.createNew(userName, userCreatorId)
        linkedOpponentService.linkWithCreator(opponentId, userCreatorId)
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

    fun findById(id: Id): OpponentDto? =
        opponentDao.findById(id)

    fun create(request: SaveOpponentRequest, currentUserId: Id): Id {
        if (!request.isLinkedToUser()) {
            return opponentDao.createNew(request.opponentName, currentUserId)
        }
        val userId = userService.findIdByName(request.existingUserName!!)
            ?: throw ResourceNotFoundException("Cannot find user[${request.existingUserName}]")

        return createAndLinkWithUser(request.opponentName, currentUserId, userId, WAITING_FOR_CONFIRMATION)
    }

    fun createAndLinkWithUser(
        name: String,
        creatorId: Id,
        linkedTo: Id,
        status: LinkedOpponentStatus = WAITING_FOR_CONFIRMATION
    ): Id {
        val opponentId = opponentDao.createNew(name, creatorId)
        linkedOpponentService.linkWithUser(opponentId, linkedTo, status)
        return opponentId
    }

    fun existsForCurrentUser(name: String): Boolean =
        opponentDao.exists(name, currentUserService.currentUserId())

    fun update(opponentId: Id, request: SaveOpponentRequest) {
        opponentDao.updateName(opponentId, request.opponentName)

        if (!request.isLinkedToUser()) {
            linkedOpponentService.removeLinkedUser(opponentId)
            return
        }
        val currentOpponent = findById(opponentId)
            ?: throw ResourceNotFoundException("Cannot find opponent with id [${opponentId}]")

        if (currentOpponent.linkedUser == null || currentOpponent.linkedUser.userName != request.existingUserName) {
            val userId = userService.findIdByName(request.existingUserName!!)
                ?: throw ResourceNotFoundException("Cannot find user with name ${request.existingUserName}")
            linkedOpponentService.removeLinkedUser(opponentId)
            linkedOpponentService.linkWithUser(opponentId, userId, WAITING_FOR_CONFIRMATION)
        }
    }

    fun findFrequentOpponents(userId: Id): List<OpponentDto> {
        val maxNumberOfOpponents = environmentService.getInt(MAX_NUMBER_OF_FREQUENT_OPPONENTS)
        val mostFrequentOpponents = opponentStatsDao.findMostFrequentOpponents(userId, maxNumberOfOpponents)
        val recentlyPlayedOpponents = opponentStatsDao.findOpponentsWithMostRecentPlays(userId, maxNumberOfOpponents)
        return (recentlyPlayedOpponents + mostFrequentOpponents).distinct()
    }
}
