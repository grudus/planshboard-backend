package com.grudus.planshboard.opponents

import com.grudus.planshboard.AuthenticatedControllerTest
import com.grudus.planshboard.boardgames.BoardGameService
import com.grudus.planshboard.boardgames.model.BoardGameOptions
import com.grudus.planshboard.boardgames.model.CreateBoardGameRequest
import com.grudus.planshboard.commons.Id
import com.grudus.planshboard.commons.responses.IdResponse
import com.grudus.planshboard.commons.validation.ValidationKeys
import com.grudus.planshboard.opponents.model.LinkedOpponentStatus.LINKED_WITH_CREATOR
import com.grudus.planshboard.opponents.model.LinkedOpponentStatus.WAITING_FOR_CONFIRMATION
import com.grudus.planshboard.opponents.model.SaveOpponentRequest
import com.grudus.planshboard.plays.PlayService
import com.grudus.planshboard.plays.model.PlayResult
import com.grudus.planshboard.plays.model.SavePlayRequest
import com.grudus.planshboard.utils.TestUtils.hasSize
import com.grudus.planshboard.utils.randomText
import org.hamcrest.CoreMatchers.notNullValue
import org.hamcrest.CoreMatchers.nullValue
import org.hamcrest.Matchers
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

class OpponentControllerTest : AuthenticatedControllerTest() {
    @Autowired
    private lateinit var playService: PlayService

    @Autowired
    private lateinit var boardGameService: BoardGameService

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
        val request = SaveOpponentRequest(randomText())
        postRequest(baseUrl, request)
            .andExpect(status().isCreated)
            .andExpect(jsonPath("$.id", notNullValue()))
    }

    @Test
    fun `should perform validation when creating opponent`() {
        val request = SaveOpponentRequest(" ")
        postRequest(baseUrl, request)
            .andExpectValidationError(ValidationKeys.EMPTY_FIELD)
    }

    @Test
    fun `should find created opponent by id`() {
        val request = SaveOpponentRequest(randomText())

        val id = postRequest(baseUrl, request)
            .andExpect(status().isCreated)
            .getResponse(IdResponse::class.java).id

        getRequest("$baseUrl/$id")
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.opponent.name").value(request.opponentName))
    }

    @Test
    fun `should not be able to get someone else's opponent`() {
        val id = addOpponent(SaveOpponentRequest(randomText()))
        setupAuthContextForAnotherUser()
        addOpponent(SaveOpponentRequest(randomText()))

        getRequest("$baseUrl/$id")
            .andExpect(status().isForbidden)
    }

    @Test
    fun `should find created opponents`() {
        addOpponent(SaveOpponentRequest(randomText()))
        addOpponent(SaveOpponentRequest(randomText()))
        val anotherUser = randomText()
        addUser(anotherUser)
        addOpponent(SaveOpponentRequest(randomText(), anotherUser))

        getRequest(baseUrl)
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.[*]", hasSize(4))) //one opponent is created when adding user
    }

    @Test
    fun `should not be able to link 2 opponents to the same user`() {
        val anotherUser = randomText()
        addUser(anotherUser)
        addOpponent(SaveOpponentRequest(randomText(), anotherUser))

        postRequest(baseUrl, SaveOpponentRequest(randomText(), anotherUser))
            .andExpectValidationError(ValidationKeys.USER_ALREADY_LINKED)
    }

    @Test
    fun `should be able to link the same user to opponents on different creator user`() {
        val linkedUserName = randomText()
        addUser(linkedUserName)

        addOpponent(SaveOpponentRequest(randomText(), linkedUserName))

        setupAuthContextForAnotherUser()

        postRequest(baseUrl, SaveOpponentRequest(randomText(), linkedUserName))
            .andExpect(status().isCreated)
    }

    @Test
    fun `should be able to link user to opponent and get it's data`() {
        val linkedUserName = randomText()
        addUser(linkedUserName)
        addOpponent(SaveOpponentRequest(randomText(), linkedUserName))

        getRequest(baseUrl)
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.[0].linkedUser.userName").value(authentication.username))
            .andExpect(jsonPath("$.[0].linkedUser.status").value(LINKED_WITH_CREATOR.name))
            .andExpect(jsonPath("$.[1].linkedUser.userName").value(linkedUserName))
            .andExpect(jsonPath("$.[1].linkedUser.status").value(WAITING_FOR_CONFIRMATION.name))
    }

    @Test
    fun `should update user's name`() {
        val oldName = randomText()
        val updatedName = randomText()
        val id = addOpponent(SaveOpponentRequest(oldName))

        putRequest("$baseUrl/$id", SaveOpponentRequest(updatedName))
            .andExpect(status().is2xxSuccessful)

        getRequest("$baseUrl/$id")
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.opponent.id").value(id))
            .andExpect(jsonPath("$.opponent.name").value(updatedName))
    }

    @Test
    fun `should remove assigned user when update opponent name and existing user name is empty`() {
        val linkedUserName = randomText()
        addUser(linkedUserName)
        val id = addOpponent(SaveOpponentRequest(randomText(), linkedUserName))

        putRequest("$baseUrl/$id", SaveOpponentRequest(randomText()))
            .andExpect(status().is2xxSuccessful)

        getRequest("$baseUrl/$id")
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.opponent.linkedUser", nullValue()))
    }


    @Test
    fun `should rename opponent and keep linked user`() {
        val linkedUserName = randomText()
        addUser(linkedUserName)
        val oldOpponentName = randomText()
        val updatedOpponentName = randomText()
        val id = addOpponent(SaveOpponentRequest(oldOpponentName, linkedUserName))

        putRequest("$baseUrl/$id", SaveOpponentRequest(updatedOpponentName, linkedUserName))
            .andExpect(status().is2xxSuccessful)

        getRequest("$baseUrl/$id")
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.opponent.name").value(updatedOpponentName))
            .andExpect(jsonPath("$.opponent.linkedUser", notNullValue()))
            .andExpect(jsonPath("$.opponent.linkedUser.userName").value(linkedUserName))
    }


    @Test
    fun `should change user assigned to opponent`() {
        val oldLinkedUserName = randomText()
        val updatedLinkedUserName = randomText()
        addUser(updatedLinkedUserName)
        addUser(oldLinkedUserName)
        val id = addOpponent(SaveOpponentRequest(randomText(), oldLinkedUserName))

        putRequest("$baseUrl/$id", SaveOpponentRequest(randomText(), updatedLinkedUserName))
            .andExpect(status().is2xxSuccessful)

        getRequest("$baseUrl/$id")
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.opponent.linkedUser", notNullValue()))
            .andExpect(jsonPath("$.opponent.linkedUser.userName").value(updatedLinkedUserName))
            .andExpect(jsonPath("$.opponent.linkedUser.status").value(WAITING_FOR_CONFIRMATION.name))
    }


    @Test
    fun `should perform validation when updating opponent`() {
        val linkedUserName = randomText()
        addUser(linkedUserName)
        val id = addOpponent(SaveOpponentRequest(randomText(), linkedUserName))

        putRequest("$baseUrl/$id", SaveOpponentRequest(randomText(), randomText()))
            .andExpectValidationError(ValidationKeys.UNKNOWN_USER)
    }

    @Test
    fun `should not be able to update someone else's opponent`() {
        val id = addOpponent(SaveOpponentRequest(randomText()))
        setupAuthContextForAnotherUser()

        putRequest("$baseUrl/$id", SaveOpponentRequest(randomText()))
            .andExpect(status().isForbidden)
    }

    @Test
    fun `should return opponents without plays when no opponent has play`() {
        addOpponent(SaveOpponentRequest(randomText()))
        addOpponent(SaveOpponentRequest(randomText()))

        getRequest("$baseUrl/frequent")
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.[*]", hasSize(2)))
    }

    @Test
    fun `should return empty list when accessing frequent opponents without any opponent`() {
        getRequest("$baseUrl/frequent")
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.[*]", hasSize(0)))
    }

    @Test
    fun `should return distinct frequent opponents`() {
        val opponent1 = addOpponent(SaveOpponentRequest(randomText()))
        val opponent2 = addOpponent(SaveOpponentRequest(randomText()))

        val boardGame = addBoardGame()
        playService.createPlayAndNotify(SavePlayRequest(boardGame, listOf(PlayResult(opponent1)), emptyList()))
        playService.createPlayAndNotify(SavePlayRequest(boardGame, listOf(PlayResult(opponent2)), emptyList()))
        playService.createPlayAndNotify(SavePlayRequest(boardGame, listOf(PlayResult(opponent1), PlayResult(opponent2)), emptyList()))

        getRequest("$baseUrl/frequent")
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.[*]", hasSize(2)))
    }

    @Test
    fun `should get frequent opponents sorted by most recent plays first, then by number of plays`() {
        val opponent1 = addOpponent(SaveOpponentRequest(randomText()))
        val opponent2 = addOpponent(SaveOpponentRequest(randomText()))
        val opponent3 = addOpponent(SaveOpponentRequest(randomText()))

        val boardGame = addBoardGame()
        playService.createPlayAndNotify(SavePlayRequest(boardGame, listOf(PlayResult(opponent3)), emptyList()))
        playService.createPlayAndNotify(SavePlayRequest(boardGame, listOf(PlayResult(opponent3)), emptyList()))
        playService.createPlayAndNotify(SavePlayRequest(boardGame, listOf(PlayResult(opponent2)), emptyList()))

        getRequest("$baseUrl/frequent")
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.[*]", hasSize(3)))
            .andExpect(jsonPath("$.[0].id").value(opponent2))
            .andExpect(jsonPath("$.[1].id").value(opponent3))
            .andExpect(jsonPath("$.[2].id").value(opponent1))
    }

    private fun addBoardGame() = boardGameService.createBoardGame(authentication.id, CreateBoardGameRequest(randomText(), BoardGameOptions.default()))

    private fun addOpponent(saveOpponentRequest: SaveOpponentRequest): Id =
        postRequest(baseUrl, saveOpponentRequest)
            .andExpect(status().isCreated)
            .getResponse(IdResponse::class.java).id
}
