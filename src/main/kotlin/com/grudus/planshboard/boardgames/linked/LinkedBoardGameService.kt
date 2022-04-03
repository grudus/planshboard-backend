package com.grudus.planshboard.boardgames.linked

import com.grudus.planshboard.boardgames.model.LinkedBoardGame
import com.grudus.planshboard.commons.Id
import com.grudus.planshboard.commons.cache.CacheKeys
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.cache.annotation.CacheConfig
import org.springframework.cache.annotation.CacheEvict
import org.springframework.cache.annotation.Cacheable
import org.springframework.stereotype.Service

@Service
@CacheConfig(cacheNames = [CacheKeys.LINKED_BOARD_GAMES])
class LinkedBoardGameService
@Autowired
constructor(
    private val linkedBoardGameDao: LinkedBoardGameDao,
) {

    @CacheEvict(key = "#userId")
    fun linkBoardGame(userId: Id, boardGameId: Id): Int {
        return linkedBoardGameDao.linkBoardGame(userId, boardGameId)
    }

    @Cacheable(key = "#userId")
    fun findBoardGamesLinkedWithUser(userId: Id): List<LinkedBoardGame> {
        return linkedBoardGameDao.findBoardGamesLinkedWithUser(userId)
    }
}
