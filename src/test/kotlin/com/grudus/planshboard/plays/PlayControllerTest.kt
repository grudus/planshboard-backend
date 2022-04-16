package com.grudus.planshboard.plays

import com.grudus.planshboard.AuthenticatedControllerTest
import com.grudus.planshboard.boardgames.model.BoardGameOptions
import com.grudus.planshboard.boardgames.model.CreateBoardGameRequest
import com.grudus.planshboard.commons.responses.IdResponse
import com.grudus.planshboard.commons.validation.ValidationKeys
import com.grudus.planshboard.opponents.model.SaveOpponentRequest
import com.grudus.planshboard.plays.model.PlayResult
import com.grudus.planshboard.plays.model.SavePlayRequest
import com.grudus.planshboard.utils.TestUtils.hasSize
import com.grudus.planshboard.utils.TestUtils.isIsoDate
import com.grudus.planshboard.utils.randomText
import java.time.LocalDateTime
import kotlin.random.Random.Default.nextLong
import org.hamcrest.CoreMatchers.notNullValue
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

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
            .andExpectValidationError(ValidationKeys.INVALID_OPPONENT)
    }

    @Test
    fun `should create new tags when saving plays`() {
        val boardGameId = addBoardGame()
        val opponentId = addOpponent()
        val tag1 = "a" + randomText()
        val tag2 = "b" + randomText()

        val request = SavePlayRequest(
            boardGameId,
            listOf(PlayResult(opponentId, 1, 1)),
            listOf(tag1, tag2),
            LocalDateTime.now().minusDays(2),
            randomText()
        )

        postCreatePlay(request)

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
        val tag1 = "a" + randomText()
        val tag2 = "b" + randomText()

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
        val tag1 = "a" + randomText()
        val tag2 = "b" + randomText()

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

            postCreatePlay(request)
        }

        getRequest("/api/tags")
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.[*]", hasSize(4)))
            .andExpect(jsonPath("$.[0].count").value(3))
            .andExpect(jsonPath("$.[1].count").value(1))
            .andExpect(jsonPath("$.[2].count").value(1))
    }

    @Test
    fun `should fetch all plays created by user`() {
        (0 until 8).forEach { i ->
            val request = SavePlayRequest(
                boardGameId = addBoardGame(),
                results = listOf(PlayResult(addOpponent(), i)),
                tags = listOf(randomText(), randomText()),
            )

            postCreatePlay(request)
        }

        runWithAnotherUserContext {
            postCreatePlay(SavePlayRequest(addBoardGame(), listOf(PlayResult(addOpponent()))))
        }

        getRequest("/api/plays")
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.[*]", hasSize(8)))
    }

    @Test
    fun `should return all play fields when fetching plays`() {
        val opponent = addOpponent()
        val game = addBoardGame()
        val date = LocalDateTime.now()

        val request = SavePlayRequest(
            boardGameId = game,
            results = listOf(PlayResult(opponent, 22, 1), PlayResult(addOpponent(), position = 1)),
            tags = listOf(randomText(), randomText()),
            date = date,
            note = randomText(),
        )
        val playId = postCreatePlay(request).id

        getRequest("/api/plays")
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.[*]", hasSize(1)))
            .andExpect(jsonPath("$.[0].id").value(playId))
            .andExpect(jsonPath("$.[0].boardGameId").value(game))
            .andExpect(jsonPath("$.[0].date", isIsoDate(date)))
            .andExpect(jsonPath("$.[0].tags.[*]", hasSize(2)))
            .andExpect(jsonPath("$.[0].results.[*]", hasSize(2)))
            .andExpect(jsonPath("$.[0].results[*].opponentId", notNullValue()))
    }

    @Test
    fun `should return all plays sorted by date desc`() {
        val opponent = addOpponent()
        val game = addBoardGame()
        val date = LocalDateTime.now()

        val play1 = postCreatePlay(SavePlayRequest(game, listOf(PlayResult(opponent, 22)), date = date.minusMonths(1))).id
        val play2 = postCreatePlay(SavePlayRequest(game, listOf(PlayResult(opponent, 11)), date = date)).id
        val play3 = postCreatePlay(SavePlayRequest(game, listOf(PlayResult(opponent, 33)), date = date.minusMonths(3))).id


        getRequest("/api/plays")
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.[*]", hasSize(3)))
            .andExpect(jsonPath("$.[0].id").value(play2))
            .andExpect(jsonPath("$.[0].results[0].points").value(11))
            .andExpect(jsonPath("$.[1].id").value(play1))
            .andExpect(jsonPath("$.[1].results[0].points").value(22))
            .andExpect(jsonPath("$.[2].id").value(play3))
            .andExpect(jsonPath("$.[2].results[0].points").value(33))
    }
    @Test
    fun `should return an empty list when there is no user's plays`() {
        runWithAnotherUserContext {
            postCreatePlay(SavePlayRequest(addBoardGame(), listOf(PlayResult(addOpponent()))))
        }

        getRequest("/api/plays")
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.[*]", hasSize(0)))
    }

    private fun postCreatePlay(request: SavePlayRequest): IdResponse =
        postRequest(baseUrl, request).andExpect(status().isCreated)
            .getResponse(IdResponse::class.java)


    private fun addOpponent() =
        postRequest("/api/opponents", SaveOpponentRequest(randomText()))
            .getResponse(IdResponse::class.java)
            .id

    private fun addBoardGame() =
        postRequest("/api/board-games", CreateBoardGameRequest(randomText(), BoardGameOptions.default()))
            .getResponse(IdResponse::class.java)
            .id
}
