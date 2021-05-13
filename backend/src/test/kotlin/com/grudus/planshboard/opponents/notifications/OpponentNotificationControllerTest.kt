package com.grudus.planshboard.opponents.notifications

import com.fasterxml.jackson.core.type.TypeReference
import com.grudus.planshboard.AuthenticatedControllerTest
import com.grudus.planshboard.auth.UserAuthentication
import com.grudus.planshboard.commons.Id
import com.grudus.planshboard.commons.responses.IdResponse
import com.grudus.planshboard.commons.validation.ValidationKeys
import com.grudus.planshboard.notifications.model.Notification
import com.grudus.planshboard.opponents.model.LinkedOpponentStatus
import com.grudus.planshboard.opponents.model.OpponentListItem
import com.grudus.planshboard.opponents.model.SaveOpponentRequest
import com.grudus.planshboard.utils.TestUtils.hasSize
import com.grudus.planshboard.utils.randomText
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Test
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

class OpponentNotificationControllerTest : AuthenticatedControllerTest() {
    private val baseUrl = "/api/opponent-notifications"

    @Test
    fun `should be able to accept opponent linked notification`() {
        linkCurrentUserWithSomeoneOpponent()

        postRequest("$baseUrl/accept", acceptRequest())
            .andExpect(status().isOk)
    }

    @Test
    fun `should return notification after accepting opponent request`() {
        linkCurrentUserWithSomeoneOpponent()

        val id = getLatestNotificationId()
        postRequest("$baseUrl/accept", acceptRequest(id))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.id").value(id))
            .andExpect(jsonPath("$.possibleActions", hasSize(0)))
    }

    @Test
    fun `should not be able to accept opponent linked notification twice`() {
        linkCurrentUserWithSomeoneOpponent()

        postRequest("$baseUrl/accept", acceptRequest())
            .andExpect(status().isOk)

        postRequest("$baseUrl/accept", acceptRequest())
            .andExpectValidationError(ValidationKeys.CANNOT_BE_LINKED)
    }


    @Test
    fun `should not be able to accept someone else's opponent linked notification`() {
        val username = randomText()
        val userId = addUser(username)
        addOpponent(SaveOpponentRequest(randomText(), username))
        var anotherUserNotificationId: Id? = null

        runWithAnotherUserContext(UserAuthentication(userId, username)) {
            anotherUserNotificationId = getLatestNotificationId()
        }

        postRequest("$baseUrl/accept", acceptRequest(anotherUserNotificationId!!))
            .andExpectValidationError(ValidationKeys.CANNOT_BE_LINKED)
    }

    @Test
    fun `should not be able to accept non existed notification`() {
        postRequest("$baseUrl/accept", acceptRequest(11L))
            .andExpectValidationError(ValidationKeys.CANNOT_BE_LINKED)
    }

    @Test
    fun `should not be able to accept with existing opponent's name`() {
        linkCurrentUserWithSomeoneOpponent()

        val name = randomText()
        addOpponent(SaveOpponentRequest(name))

        val request = acceptRequest().copy(opponent = SelectedOpponent(name))

        postRequest("$baseUrl/accept", request)
            .andExpectValidationError(ValidationKeys.OPPONENT_ALREADY_EXISTS)
    }


    @Test
    fun `should not be able to accept with linked someone else's opponent`() {
        val opponentId = linkCurrentUserWithSomeoneOpponent()

        val request = acceptRequest().copy(opponent = SelectedOpponent(existingOpponentId = opponentId))

        postRequest("$baseUrl/accept", request)
            .andExpectValidationError(ValidationKeys.INVALID_OPPONENT)
    }

    @Test
    fun `should create opponent when accepting with new opponent name`() {
        linkCurrentUserWithSomeoneOpponent()

        val newOpponentName = randomText()
        val request = acceptRequest().copy(opponent = SelectedOpponent(newOpponentName = newOpponentName))

        postRequest("$baseUrl/accept", request)
            .andExpect(status().isOk)

        val opponents = getRequest("/api/opponents")
            .andExpect(status().isOk)
            .getResponse(object : TypeReference<List<OpponentListItem>>() {})

        val newlyCreatedOpponent = opponents.find { it.name == newOpponentName }!!

        assertNotNull(newlyCreatedOpponent.linkedUser)
        assertEquals(LinkedOpponentStatus.ENABLED, newlyCreatedOpponent.linkedUser!!.status)
    }

    private fun linkCurrentUserWithSomeoneOpponent(): Id {
        val currentUsername = authentication.username

        return runWithAnotherUserContext {
            addOpponent(SaveOpponentRequest(randomText(), currentUsername))
        }
    }


    private fun acceptRequest(id: Id = getLatestNotificationId()): AcceptOpponentLinkedRequest =
        AcceptOpponentLinkedRequest(id, SelectedOpponent(randomText()))

    private fun getLatestNotificationId(): Id =
        getRequest("/api/notifications", "limitPerPage" to 1)
            .andExpect(status().isOk)
            .getResponse(object : TypeReference<List<Notification<*>>>() {})[0].id
            ?: throw AssertionError("Cannot find any notification")


    private fun addOpponent(saveOpponentRequest: SaveOpponentRequest): Id =
        postRequest("/api/opponents", saveOpponentRequest)
            .andExpect(status().isCreated)
            .getResponse(IdResponse::class.java).id

}
