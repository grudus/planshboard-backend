package com.grudus.planshboard.boardgames.linked

import com.grudus.planshboard.boardgames.model.LinkedBoardGame
import com.grudus.planshboard.commons.Id
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class LinkedBoardGameService
@Autowired
constructor(private val linkedBoardGameDao: LinkedBoardGameDao) {

    // TODO Update cache
    fun linkBoardGame(userId: Id, boardGameId: Id): Int =
        linkedBoardGameDao.linkBoardGame(userId, boardGameId)


    // TODO Get from cache
    fun findBoardGamesLinkedWithUser(userId: Id, withHidden: Boolean = true): List<LinkedBoardGame> =
        linkedBoardGameDao.findBoardGamesLinkedWithUser(userId, withHidden)
}
