package com.grudus.planshboard.plays

import com.grudus.planshboard.AuthenticatedControllerTest
import com.grudus.planshboard.boardgames.model.CreateBoardGameRequest
import com.grudus.planshboard.commons.responses.IdResponse
import com.grudus.planshboard.commons.validation.ValidationKeys
import com.grudus.planshboard.opponents.model.SaveOpponentRequest
import com.grudus.planshboard.plays.model.PlayResult
import com.grudus.planshboard.plays.model.SavePlayRequest
import com.grudus.planshboard.utils.TestUtils.hasSize
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

        val request = SavePlayRequest(
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

        val request = SavePlayRequest(
            boardGameId,
            listOf(PlayResult(nextLong(), 1, 1)), listOf(randomText()),
            LocalDateTime.now().minusDays(2),
            randomText()
        )

        postRequest(baseUrl, request)
            .andExpect(status().isBadRequest)
            .andExpect(jsonPath("$.code").value(ValidationKeys.INVALID_OPPONENT))

    }

    @Test
    fun `should create new tags when saving plays`() {
        val boardGameId = addBoardGame()
        val opponentId = addOpponent()
        val tag1 = "a" + randomText();
        val tag2 = "b" + randomText();

        val request = SavePlayRequest(
            boardGameId,
            listOf(PlayResult(opponentId, 1, 1)),
            listOf(tag1, tag2),
            LocalDateTime.now().minusDays(2),
            randomText()
        )

        postRequest(baseUrl, request)
            .andExpect(status().isCreated)

        getRequest("/api/tags")
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.[*]", hasSize(2)))
            .andExpect(jsonPath("$.[0].name").value(tag1))
            .andExpect(jsonPath("$.[1].name").value(tag2))
    }


    @Test
    fun `should add new tag when update play`() {
        val boardGameId = addBoardGame()
        val opponentId = addOpponent()
        val tag1 = "a" + randomText();
        val tag2 = "b" + randomText();

        val saveRequest = SavePlayRequest(
            boardGameId,
            listOf(PlayResult(opponentId, 1, 1)),
            listOf(tag1)
        )
        val updateRequest = saveRequest.copy(tags = listOf(tag1, tag2))

        val id = postRequest(baseUrl, saveRequest)
            .andExpect(status().isCreated)
            .getResponse(IdResponse::class.java).id

        putRequest("$baseUrl/$id", updateRequest)
            .andExpect(status().isOk)


        getRequest("/api/tags")
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.[*]", hasSize(2)))
            .andExpect(jsonPath("$.[0].name").value(tag1))
            .andExpect(jsonPath("$.[0].count").value(1))
            .andExpect(jsonPath("$.[1].count").value(1))
            .andExpect(jsonPath("$.[1].name").value(tag2))
    }

    @Test
    fun `should remove tag assigned to play when updating play without that tag`() {
        val boardGameId = addBoardGame()
        val opponentId = addOpponent()
        val tag1 = "a" + randomText();
        val tag2 = "b" + randomText();

        val saveRequest = SavePlayRequest(
            boardGameId,
            listOf(PlayResult(opponentId, 1, 1)),
            listOf(tag1, tag2)
        )
        val updateRequest = saveRequest.copy(tags = listOf(tag1))

        val id = postRequest(baseUrl, saveRequest)
            .andExpect(status().isCreated)
            .getResponse(IdResponse::class.java).id

        putRequest("$baseUrl/$id", updateRequest)
            .andExpect(status().isOk)


        getRequest("/api/tags")
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.[*]", hasSize(2)))
            .andExpect(jsonPath("$.[0].name").value(tag1))
            .andExpect(jsonPath("$.[0].count").value(1))
            .andExpect(jsonPath("$.[1].count").value(0))
            .andExpect(jsonPath("$.[1].name").value(tag2))
    }

    @Test
    fun `should not be able to edit someone else's play`() {
        val boardGameId = addBoardGame()
        val opponentId = addOpponent()

        val saveRequest = SavePlayRequest(
            boardGameId,
            listOf(PlayResult(opponentId, 1, 1)),
            emptyList()
        )

        val id = postRequest(baseUrl, saveRequest)
            .andExpect(status().isCreated)
            .getResponse(IdResponse::class.java).id

        setupAuthContextForAnotherUser()

        putRequest("$baseUrl/$id", saveRequest)
            .andExpect(status().isForbidden)
    }

    @Test
    fun `should increase tag count when saving tag another time`() {
        val boardGameId = addBoardGame()
        val opponentId = addOpponent()
        val tag = "a" + randomText()

        (0 until 3).forEach { _ ->
            val request = SavePlayRequest(
                boardGameId,
                listOf(PlayResult(opponentId, 1, 1)),
                listOf(tag, "z" + randomText()),
                LocalDateTime.now().minusDays(2),
                randomText()
            )

            postRequest(baseUrl, request).andExpect(status().isCreated)
        }

        getRequest("/api/tags")
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.[*]", hasSize(4)))
            .andExpect(jsonPath("$.[0].count").value(3))
            .andExpect(jsonPath("$.[1].count").value(1))
            .andExpect(jsonPath("$.[2].count").value(1))
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
