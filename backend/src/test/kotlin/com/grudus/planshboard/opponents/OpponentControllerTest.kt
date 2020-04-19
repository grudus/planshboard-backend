package com.grudus.planshboard.opponents

import com.grudus.planshboard.AuthenticatedControllerTest
import com.grudus.planshboard.commons.Id
import com.grudus.planshboard.commons.responses.IdResponse
import com.grudus.planshboard.commons.validation.ValidationKeys
import com.grudus.planshboard.opponents.model.CreateOpponentRequest
import com.grudus.planshboard.opponents.model.LinkedOpponentStatus.LINKED_WITH_CREATOR
import com.grudus.planshboard.opponents.model.LinkedOpponentStatus.WAITING_FOR_CONFIRMATION
import com.grudus.planshboard.utils.TestUtils.hasSize
import com.grudus.planshboard.utils.randomText
import org.hamcrest.CoreMatchers.notNullValue
import org.hamcrest.Matchers
import org.junit.jupiter.api.Test
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

class OpponentControllerTest : AuthenticatedControllerTest() {
    private val baseUrl = "/api/opponents"

    @Test
    fun shouldGetInitialOpponent() {
        getRequest(baseUrl)
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.[*]", hasSize(1)))
            .andExpect(jsonPath("$.[0].id").isNotEmpty)
            .andExpect(jsonPath("$.[0].name").isNotEmpty)
            .andExpect(jsonPath("$.[0].linkedUser.userName").value(authentication.username))
            .andExpect(jsonPath("$.[0].linkedUser.status").value(LINKED_WITH_CREATOR.name))
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

    @Test
    fun `should not be able to get someone else's opponent`() {
        val id = addOpponent(CreateOpponentRequest(randomText()))
        setupAuthContextForAnotherUser()
        addOpponent(CreateOpponentRequest(randomText()))

        getRequest("$baseUrl/$id")
            .andExpect(status().isForbidden)
    }

    @Test
    fun `should find created opponents`() {
        addOpponent(CreateOpponentRequest(randomText()))
        addOpponent(CreateOpponentRequest(randomText()))
        val anotherUser = randomText()
        addUser(anotherUser)
        addOpponent(CreateOpponentRequest(randomText(), anotherUser))

        getRequest(baseUrl)
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.[*]", hasSize(4))) //one opponent is created when adding user
    }

    @Test
    fun `should not be able to link 2 opponents to the same user`() {
        val anotherUser = randomText()
        addUser(anotherUser)
        addOpponent(CreateOpponentRequest(randomText(), anotherUser))

        postRequest(baseUrl, CreateOpponentRequest(randomText(), anotherUser))
            .andExpect(status().isBadRequest)
            .andExpect(jsonPath("$.code").value(ValidationKeys.USER_ALREADY_LINKED))
    }

    @Test
    fun `should be able to link the same user to opponents on different creator user`() {
        val linkedUserName = randomText()
        addUser(linkedUserName)

        addOpponent(CreateOpponentRequest(randomText(), linkedUserName))

        setupAuthContextForAnotherUser()

        postRequest(baseUrl, CreateOpponentRequest(randomText(), linkedUserName))
            .andExpect(status().isCreated)
    }

    @Test
    fun `should be able to link user to opponent and get it's data`() {
        val linkedUserName = randomText()
        addUser(linkedUserName)
        addOpponent(CreateOpponentRequest(randomText(), linkedUserName))

        getRequest(baseUrl)
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.[0].linkedUser.userName").value(authentication.username))
            .andExpect(jsonPath("$.[0].linkedUser.status").value(LINKED_WITH_CREATOR.name))
            .andExpect(jsonPath("$.[1].linkedUser.userName").value(linkedUserName))
            .andExpect(jsonPath("$.[1].linkedUser.status").value(WAITING_FOR_CONFIRMATION.name))
    }

    private fun addOpponent(createOpponentRequest: CreateOpponentRequest): Id =
        postRequest(baseUrl, createOpponentRequest)
            .andExpect(status().isCreated)
            .getResponse(IdResponse::class.java).id
}
