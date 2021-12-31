package com.grudus.planshboard.boardgames.linked

import com.grudus.planshboard.AbstractDatabaseTest
import com.grudus.planshboard.TestConstants.NUMBER_OF_ITEMS_IN_CACHE
import com.grudus.planshboard.boardgames.BoardGameService
import com.grudus.planshboard.boardgames.model.BoardGameOptions
import com.grudus.planshboard.boardgames.model.CreateBoardGameRequest
import com.grudus.planshboard.commons.Id
import com.grudus.planshboard.commons.cache.CacheKeys
import com.grudus.planshboard.utils.CacheUtils
import com.grudus.planshboard.utils.randomId
import com.grudus.planshboard.utils.randomText
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.cache.CacheManager

class LinkedBoardGameServiceTest : AbstractDatabaseTest() {

    @Autowired
    private lateinit var boardGameService: BoardGameService

    @Autowired
    private lateinit var linkedBoardGameService: LinkedBoardGameService

    @Autowired
    private lateinit var cacheManager: CacheManager

    @AfterEach
    fun `clean cache`() {
        CacheUtils.clearStats(cacheManager.getCache(CacheKeys.LINKED_BOARD_GAMES)!!)
    }

    @Test
    fun `should use cache when accessing linked games for same id`() {
        val id = randomId()
        (0 until NUMBER_OF_ITEMS_IN_CACHE / 2)
            .forEach { _ -> linkedBoardGameService.findBoardGamesLinkedWithUser(id) }

        val cache = cacheManager.getCache(CacheKeys.LINKED_BOARD_GAMES)!!

        assertEquals(1L, CacheUtils.loadFromInitialSourceCount(cache))
        assertEquals(NUMBER_OF_ITEMS_IN_CACHE / 2 - 1, CacheUtils.retrieveFromCacheCount(cache))
    }

    @Test
    fun `should invalidate cache when linking another game`() {
        val userId = addUser()
        linkedBoardGameService.findBoardGamesLinkedWithUser(userId)
        linkedBoardGameService.linkBoardGame(userId, addBoardGame())
        linkedBoardGameService.findBoardGamesLinkedWithUser(userId)

        val cache = cacheManager.getCache(CacheKeys.LINKED_BOARD_GAMES)!!

        assertEquals(2L, CacheUtils.loadFromInitialSourceCount(cache))
        assertEquals(0, CacheUtils.retrieveFromCacheCount(cache))
    }

    @Test
    fun `should not invalidate cache when linking another user's game`() {
        val userId = addUser()
        linkedBoardGameService.findBoardGamesLinkedWithUser(userId)
        linkedBoardGameService.linkBoardGame(addUser(), addBoardGame())
        linkedBoardGameService.findBoardGamesLinkedWithUser(userId)

        val cache = cacheManager.getCache(CacheKeys.LINKED_BOARD_GAMES)!!

        assertEquals(1L, CacheUtils.loadFromInitialSourceCount(cache))
        assertEquals(1L, CacheUtils.retrieveFromCacheCount(cache))
    }

    private fun addBoardGame(): Id {
        return boardGameService.createBoardGame(
            addUser(),
            CreateBoardGameRequest(randomText(), BoardGameOptions.default())
        )
    }
}
