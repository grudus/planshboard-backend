package com.grudus.planshboard.plays.tags

import com.grudus.planshboard.AuthenticatedControllerTest
import com.grudus.planshboard.boardgames.BoardGameService
import com.grudus.planshboard.boardgames.model.CreateBoardGameRequest
import com.grudus.planshboard.opponents.OpponentService
import com.grudus.planshboard.opponents.model.SaveOpponentRequest
import com.grudus.planshboard.plays.PlayService
import com.grudus.planshboard.plays.model.CreatePlayRequest
import com.grudus.planshboard.plays.model.PlayResult
import com.grudus.planshboard.utils.TestUtils.hasSize
import com.grudus.planshboard.utils.randomText
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

class TagControllerTest
@Autowired
constructor(private val playService: PlayService,
            private val opponentService: OpponentService,
            private val boardGameService: BoardGameService) : AuthenticatedControllerTest() {
    private val baseUrl = "/api/tags"

    @Test
    fun `should return empty list when no tags`() {
        getRequest(baseUrl)
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.[*]", hasSize(0)))
    }

    @Test
    fun `should return tags with number of assigned plays`() {
        createPlay(listOf("tag1", "tag2"))
        createPlay(listOf("tag1", "tag3"))

        getRequest(baseUrl)
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.[*]", hasSize(3)))
            .andExpect(jsonPath("$.[0].name").value("tag1"))
            .andExpect(jsonPath("$.[0].count").value(2))
            .andExpect(jsonPath("$.[1].name").value("tag2"))
            .andExpect(jsonPath("$.[1].count").value(1))
            .andExpect(jsonPath("$.[2].name").value("tag3"))
            .andExpect(jsonPath("$.[2].count").value(1))
    }

    private fun createPlay(tags: List<String>) {
        val boardGameId = boardGameService.createBoardGame(authentication.id, CreateBoardGameRequest(randomText()))
        val opponentId = opponentService.create(SaveOpponentRequest(randomText()), authentication.id)
        playService.createPlay(CreatePlayRequest(boardGameId,
            listOf(PlayResult(opponentId)),
            tags
        ))
    }

}
