package com.grudus.planshboard.plays

import com.grudus.planshboard.AuthenticatedControllerTest
import com.grudus.planshboard.boardgames.model.CreateBoardGameRequest
import com.grudus.planshboard.commons.responses.IdResponse
import com.grudus.planshboard.commons.validation.ValidationKeys
import com.grudus.planshboard.opponents.model.SaveOpponentRequest
import com.grudus.planshboard.plays.model.CreatePlayRequest
import com.grudus.planshboard.plays.model.PlayResult
import com.grudus.planshboard.utils.randomText
import org.hamcrest.CoreMatchers.notNullValue
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import java.time.LocalDateTime
import kotlin.random.Random.Default.nextLong

class PlayControllerTest
@Autowired
constructor() : AuthenticatedControllerTest() {

    private val baseUrl = "/api/plays"

    @Test
    fun `should save play correctly`() {
        val opponentId = addOpponent()
        val boardGameId = addBoardGame()

        val request = CreatePlayRequest(
            boardGameId,
            listOf(PlayResult(opponentId, 1, 1)), listOf(randomText()),
            LocalDateTime.now().minusDays(2),
            randomText()
        )

        postRequest(baseUrl, request)
            .andExpect(status().isCreated)
            .andExpect(jsonPath("$.id", notNullValue()))

    }

    @Test
    fun `should perform validation before creating play`() {
        val boardGameId = addBoardGame()

        val request = CreatePlayRequest(
            boardGameId,
            listOf(PlayResult(nextLong(), 1, 1)), listOf(randomText()),
            LocalDateTime.now().minusDays(2),
            randomText()
        )

        postRequest(baseUrl, request)
            .andExpect(status().isBadRequest)
            .andExpect(jsonPath("$.code").value(ValidationKeys.INVALID_OPPONENT))

    }

    private fun addOpponent() =
        postRequest("/api/opponents", SaveOpponentRequest(randomText()))
            .getResponse(IdResponse::class.java)
            .id

    private fun addBoardGame() =
        postRequest("/api/board-games", CreateBoardGameRequest(randomText()))
            .getResponse(IdResponse::class.java)
            .id
}
