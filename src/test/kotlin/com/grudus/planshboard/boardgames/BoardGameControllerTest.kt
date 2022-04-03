package com.grudus.planshboard.boardgames

import com.grudus.planshboard.AuthenticatedControllerTest
import com.grudus.planshboard.boardgames.model.BoardGameOptions
import com.grudus.planshboard.boardgames.model.CreateBoardGameRequest
import com.grudus.planshboard.boardgames.model.EditBoardGameRequest
import com.grudus.planshboard.commons.Id
import com.grudus.planshboard.commons.responses.IdResponse
import com.grudus.planshboard.commons.validation.ValidationKeys
import com.grudus.planshboard.utils.TestUtils.hasSize
import com.grudus.planshboard.utils.randomText
import org.hamcrest.Matchers
import org.hamcrest.Matchers.notNullValue
import org.junit.jupiter.api.Test
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import kotlin.random.Random.Default.nextLong

class BoardGameControllerTest : AuthenticatedControllerTest() {
    private val baseUrl = "/api/board-games"

    @Test
    fun `should create board game and return id`() {
        val request = CreateBoardGameRequest(randomText(), BoardGameOptions.default())
        postRequest(baseUrl, request)
            .andExpect(status().isCreated)
            .andExpect(jsonPath("$.id", notNullValue()))
    }

    @Test
    fun `should validate creating board game`() {
        val request = CreateBoardGameRequest("", BoardGameOptions.default())
        postRequest(baseUrl, request)
            .andExpectValidationError(ValidationKeys.EMPTY_FIELD)
    }

    @Test
    fun `should be able to get created board game`() {
        postRequest(baseUrl, CreateBoardGameRequest(randomText(), BoardGameOptions.default()))
        postRequest(baseUrl, CreateBoardGameRequest(randomText(), BoardGameOptions.default()))

        getRequest(baseUrl)
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.[*]", hasSize(2)))
    }

    @Test
    fun `should return empty list when no board games`() {
        getRequest(baseUrl)
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.[*]", hasSize(0)))
    }

    @Test
    fun `should get only games created current by user`() {
        postRequest(baseUrl, CreateBoardGameRequest(randomText(), BoardGameOptions.default()))
        setupAuthContextForAnotherUser()
        postRequest(baseUrl, CreateBoardGameRequest(randomText(), BoardGameOptions.default()))

        getRequest(baseUrl)
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.[*]", hasSize(1)))
    }

    @Test
    fun `should rename board game properly`() {
        val oldName = randomText()
        val newName = randomText()
        val id = addBoardGame(oldName)

        putRequest("$baseUrl/$id", EditBoardGameRequest(newName, BoardGameOptions.default()))
            .andExpect(status().isOk)

        getRequest(baseUrl)
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.[0].name").value(newName))
    }

    @Test
    fun `should not be able to rename to existing name`() {
        val oldName = randomText()
        val newName = randomText()
        val id = addBoardGame(oldName)
        addBoardGame(newName)

        putRequest("$baseUrl/$id", EditBoardGameRequest(newName, BoardGameOptions.default()))
            .andExpectValidationError(ValidationKeys.GAME_ALREADY_EXISTS)
    }

    @Test
    fun `should not be able to rename someone else's board game`() {
        val oldName = randomText()
        val newName = randomText()
        val id = addBoardGame(oldName)
        setupAuthContextForAnotherUser()

        putRequest("$baseUrl/$id", EditBoardGameRequest(newName, BoardGameOptions.default()))
            .andExpect(status().isForbidden)
    }

    @Test
    fun `should not be able to rename not existing board game`() {
        putRequest("$baseUrl/${nextLong()}", EditBoardGameRequest(randomText(), BoardGameOptions.default()))
            .andExpect(status().isForbidden)
    }

    @Test
    fun `should be able to find game by id`() {
        val name = randomText()
        addBoardGame(randomText())
        val id = addBoardGame(name)
        addBoardGame(randomText())

        getRequest("$baseUrl/$id")
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.boardGame.id").value(id))
            .andExpect(jsonPath("$.boardGame.name").value(name))
    }

    @Test
    fun `should not be able to find someone else's board game`() {
        val name = randomText()
        val id = addBoardGame(name)
        setupAuthContextForAnotherUser()

        getRequest("$baseUrl/$id")
            .andExpect(status().isForbidden)
    }

    @Test
    fun `should not be able to find non existing board game`() {
        getRequest("$baseUrl/${nextLong()}")
            .andExpect(status().isForbidden)
    }

    @Test
    fun `should remove board game`() {
        val id = addBoardGame(randomText())

        deleteRequest("$baseUrl/$id")
            .andExpect(status().isNoContent)

        getRequest("$baseUrl/$id")
            .andExpect(status().isForbidden)
    }

    @Test
    fun `should not be able to remove someone else's board game`() {
        val id = addBoardGame(randomText())
        setupAuthContextForAnotherUser()

        deleteRequest("$baseUrl/$id")
            .andExpect(status().isForbidden)
    }

    @Test
    fun `should not be able to remove non existing board game`() {
        deleteRequest("$baseUrl/${nextLong()}")
            .andExpect(status().isForbidden)
    }

    private fun addBoardGame(name: String): Id =
        postRequest(baseUrl, CreateBoardGameRequest(name, BoardGameOptions.default()))
            .getResponse(IdResponse::class.java).id

}
