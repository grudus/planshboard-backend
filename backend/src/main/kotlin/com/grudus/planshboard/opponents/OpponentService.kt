package com.grudus.planshboard.opponents

import com.grudus.planshboard.boardgames.BoardGameService
import com.grudus.planshboard.commons.Id
import com.grudus.planshboard.commons.responses.NameCount
import com.grudus.planshboard.commons.validation.InvalidRequestException
import com.grudus.planshboard.opponents.model.OpponentDto
import com.grudus.planshboard.opponents.model.OpponentListItem
import com.grudus.planshboard.opponents.model.OpponentStats
import com.grudus.planshboard.opponents.model.OpponentWithStats
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import kotlin.random.Random.Default.nextInt

@Service
class OpponentService
@Autowired
constructor(private val opponentDao: OpponentDao,
            private val boardGameService: BoardGameService) {

    fun createInitial(userName: String, userId: Id) {
        opponentDao.creteInitial(userName, userId)
    }

    // TODO mocked until plays implemented
    fun findListItems(userId: Id): List<OpponentListItem> =
        opponentDao.findListItems(userId)
            .map {
                val numberOfPlays = nextInt(1000)
                val numberOfWins = nextInt(numberOfPlays)
                val lastPlayedBoardGame = boardGameService.findBoardGamesForUser(userId).shuffled().firstOrNull()
                it.copy(numberOfPlays = numberOfPlays, numberOfWins = numberOfWins, lastPlayedBoardGame = lastPlayedBoardGame?.name)
            }

    // TODO mocked until plays implemented
    fun getWithStats(opponentId: Id, userId: Id): OpponentWithStats {
        val numberOfPlays = nextInt(1000)
        val numberOfWins = nextInt(numberOfPlays)
        val boardGame: String? = boardGameService.findBoardGamesForUser(userId).shuffled().firstOrNull()?.name

        val opponent: OpponentDto = opponentDao.findById(opponentId)!!

        val stats = OpponentStats(numberOfPlays,
            numberOfWins,
            boardGame,
            boardGame?.let { NameCount(boardGame, numberOfPlays) },
            boardGame?.let { NameCount(boardGame, numberOfWins) })

        return OpponentWithStats(opponent, stats)
    }

}
