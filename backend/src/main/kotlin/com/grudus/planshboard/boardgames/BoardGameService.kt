package com.grudus.planshboard.boardgames

import com.grudus.planshboard.boardgames.model.BoardGame
import com.grudus.planshboard.boardgames.model.CreateBoardGameRequest
import com.grudus.planshboard.commons.Id
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class BoardGameService
@Autowired
constructor(private val boardGameDao: BoardGameDao) {

    fun findBoardGamesForUser(userId: Id): List<BoardGame> {
        val userBoardGames = boardGameDao.findBoardGamesCreatedByUser(userId)
        val linkedBoardGames = boardGameDao.findBoardGamesLinkedFroUser(userId)

        return userBoardGames + linkedBoardGames
    }

    fun createBoardGame(userId: Id, createBoardGameRequest: CreateBoardGameRequest): Id =
        boardGameDao.create(userId, createBoardGameRequest.name)

    fun nameExists(currentUserId: Id, name: String): Boolean =
        boardGameDao.nameExists(currentUserId, name)

    fun rename(boardGameId: Id, newName: String) =
        boardGameDao.rename(boardGameId, newName)

    fun findById(boardGameId: Id): BoardGame? =
        boardGameDao.findById(boardGameId)
}
