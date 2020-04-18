package com.grudus.planshboard.opponents

import com.grudus.planshboard.AuthenticatedControllerTest
import com.grudus.planshboard.commons.responses.IdResponse
import com.grudus.planshboard.commons.validation.ValidationKeys
import com.grudus.planshboard.opponents.model.CreateOpponentRequest
import com.grudus.planshboard.utils.TestUtils.hasSize
import com.grudus.planshboard.utils.randomText
import org.hamcrest.CoreMatchers.notNullValue
import org.hamcrest.Matchers
import org.junit.jupiter.api.Test
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

class OpponentControllerTest: AuthenticatedControllerTest() {
    private val baseUrl = "/api/opponents"

    @Test
    fun shouldGetInitialOpponent() {
        getRequest(baseUrl)
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.[*]", hasSize(1)))
            .andExpect(jsonPath("$.[0].id").isNotEmpty)
            .andExpect(jsonPath("$.[0].name").isNotEmpty)
            .andExpect(jsonPath("$.[0].existingUserName").value(authentication.username))
    }

    @Test
    fun `should create opponent and return it's id`() {
        val request = CreateOpponentRequest(randomText())
        postRequest(baseUrl, request)
            .andExpect(status().isCreated)
            .andExpect(jsonPath("$.id", notNullValue()))
    }

    @Test
    fun `should perform validation when creating opponent`() {
        val request = CreateOpponentRequest(" ")
        postRequest(baseUrl, request)
            .andExpect(status().isBadRequest)
            .andExpect(jsonPath("$.code", Matchers.`is`(ValidationKeys.EMPTY_FIELD)))
    }

    @Test
    fun `should find created opponent by id`() {
        val request = CreateOpponentRequest(randomText())

        val id = postRequest(baseUrl, request)
            .andExpect(status().isCreated)
            .getResponse(IdResponse::class.java).id

        getRequest("$baseUrl/$id")
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.opponent.name").value(request.opponentName))
    }
}
