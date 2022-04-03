package com.grudus.planshboard.boardgames

import com.grudus.planshboard.boardgames.model.BoardGame
import com.grudus.planshboard.boardgames.model.CreateBoardGameRequest
import com.grudus.planshboard.boardgames.model.EditBoardGameRequest
import com.grudus.planshboard.boardgames.model.SingleBoardGameResponse
import com.grudus.planshboard.boardgames.options.BoardGameOptionsDao
import com.grudus.planshboard.commons.Id
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class BoardGameService
@Autowired
constructor(
    private val boardGameDao: BoardGameDao,
    private val boardGameOptionsDao: BoardGameOptionsDao
) {

    fun findBoardGamesForUser(userId: Id): List<BoardGame> {
        return boardGameDao.findBoardGamesCreatedByUser(userId)
    }

    fun createBoardGame(userId: Id, createBoardGameRequest: CreateBoardGameRequest): Id {
        val id = boardGameDao.create(userId, createBoardGameRequest.name)
        boardGameOptionsDao.createOptions(id, createBoardGameRequest.options)
        return id
    }

    fun nameExists(currentUserId: Id, name: String): Boolean =
        boardGameDao.nameExists(currentUserId, name)

    fun edit(boardGameId: Id, editBoardGameRequest: EditBoardGameRequest) {
        boardGameOptionsDao.updateOptions(boardGameId, editBoardGameRequest.options)
        boardGameDao.rename(boardGameId, editBoardGameRequest.name)
    }

    fun findById(boardGameId: Id): SingleBoardGameResponse? {
        return boardGameDao.findWithOptions(boardGameId)
    }

    fun remove(boardGameId: Id) {
        boardGameDao.remove(boardGameId)
    }
}
