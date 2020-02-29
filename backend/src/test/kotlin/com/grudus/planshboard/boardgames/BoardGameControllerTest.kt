package com.grudus.planshboard.boardgames

import com.grudus.planshboard.AuthenticatedControllerTest
import com.grudus.planshboard.boardgames.model.CreateBoardGameRequest
import com.grudus.planshboard.commons.validation.ValidationKeys
import com.grudus.planshboard.utils.TestUtils.hasSize
import com.grudus.planshboard.utils.randomText
import org.hamcrest.Matchers
import org.hamcrest.Matchers.notNullValue
import org.junit.jupiter.api.Test
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

class BoardGameControllerTest: AuthenticatedControllerTest() {
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

}
