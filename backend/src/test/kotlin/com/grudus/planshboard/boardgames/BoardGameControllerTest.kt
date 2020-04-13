package com.grudus.planshboard.boardgames

import com.grudus.planshboard.AuthenticatedControllerTest
import com.grudus.planshboard.boardgames.model.CreateBoardGameRequest
import com.grudus.planshboard.boardgames.model.RenameBoardGameRequest
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
        val request = CreateBoardGameRequest(randomText())
        postRequest(baseUrl, request)
            .andExpect(status().isCreated)
            .andExpect(jsonPath("$.id", notNullValue()))
    }

    @Test
    fun `should validate creating board game`() {
        val request = CreateBoardGameRequest("")
        postRequest(baseUrl, request)
            .andExpect(status().isBadRequest)
            .andExpect(jsonPath("$.code", Matchers.`is`(ValidationKeys.EMPTY_FIELD)))
    }

    @Test
    fun `should be able to get created board game`() {
        postRequest(baseUrl, CreateBoardGameRequest(randomText()))
        postRequest(baseUrl, CreateBoardGameRequest(randomText()))

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
        postRequest(baseUrl, CreateBoardGameRequest(randomText()))
        setupAuthContextForAnotherUser()
        postRequest(baseUrl, CreateBoardGameRequest(randomText()))

        getRequest(baseUrl)
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.[*]", hasSize(1)))
    }

    @Test
    fun `should rename board game properly`() {
        val oldName = randomText()
        val newName = randomText()
        val id = addBoardGame(oldName)

        putRequest("$baseUrl/$id", RenameBoardGameRequest(newName))
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

        putRequest("$baseUrl/$id", RenameBoardGameRequest(newName))
            .andExpect(status().isBadRequest)
            .andExpect(jsonPath("$.code").value(ValidationKeys.GAME_ALREADY_EXISTS))
    }

    @Test
    fun `should not be able to rename someone else's board game`() {
        val oldName = randomText()
        val newName = randomText()
        val id = addBoardGame(oldName)
        setupAuthContextForAnotherUser()

        putRequest("$baseUrl/$id", RenameBoardGameRequest(newName))
            .andExpect(status().isForbidden)
    }

    @Test
    fun `should not be able to rename not existing board game`() {
        putRequest("$baseUrl/${nextLong()}", RenameBoardGameRequest(randomText()))
            .andExpect(status().isForbidden)
    }

    @Test
    fun `should be able to find game by id`() {
        val name = randomText();
        addBoardGame(randomText())
        val id = addBoardGame(name)
        addBoardGame(randomText())

        getRequest("$baseUrl/$id")
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.id").value(id))
            .andExpect(jsonPath("$.name").value(name))
    }

    @Test
    fun `should not be able to find someone else's board game`() {
        val name = randomText();
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
        postRequest(baseUrl, CreateBoardGameRequest(name))
            .getResponse(IdResponse::class.java).id

}
