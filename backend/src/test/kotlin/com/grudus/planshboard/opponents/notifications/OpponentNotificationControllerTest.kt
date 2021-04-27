package com.grudus.planshboard.opponents.notifications

import com.grudus.planshboard.AuthenticatedControllerTest
import com.grudus.planshboard.auth.UserAuthentication
import com.grudus.planshboard.commons.Id
import com.grudus.planshboard.commons.responses.IdResponse
import com.grudus.planshboard.commons.validation.ValidationKeys
import com.grudus.planshboard.opponents.model.SaveOpponentRequest
import com.grudus.planshboard.utils.randomText
import org.junit.jupiter.api.Test
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

class OpponentNotificationControllerTest : AuthenticatedControllerTest() {
    private val baseUrl = "/api/opponent-notifications"

    @Test
    fun `should be able to accept opponent linked notification`() {
        val currentUsername = authentication.username

        runWithAnotherUserContext {
            addOpponent(SaveOpponentRequest(randomText(), currentUsername))
        }

        postRequest("$baseUrl/accept", AcceptOpponentLinkedRequest(getLatestNotificationId()!!))
            .andExpect(status().isOk)
    }

    @Test
    fun `should not be able to accept opponent linked notification twice`() {
        val currentUsername = authentication.username

        runWithAnotherUserContext {
            addOpponent(SaveOpponentRequest(randomText(), currentUsername))
        }

        postRequest("$baseUrl/accept", AcceptOpponentLinkedRequest(getLatestNotificationId()!!))
            .andExpect(status().isOk)

        postRequest("$baseUrl/accept", AcceptOpponentLinkedRequest(getLatestNotificationId()!!))
            .andExpectValidationError(ValidationKeys.CANNOT_BE_LINKED)
    }

    @Test
    fun `should not be able to accept someone else's opponent linked notification`() {
        val username = randomText()
        val userId = addUser(username)
        addOpponent(SaveOpponentRequest(randomText(), username))
        var anotherUserNotificationId: Id? = null

        runWithAnotherUserContext(UserAuthentication(userId, username)) {
            anotherUserNotificationId = getLatestNotificationId()!!
        }

        postRequest("$baseUrl/accept", AcceptOpponentLinkedRequest(anotherUserNotificationId!!))
            .andExpectValidationError(ValidationKeys.CANNOT_BE_LINKED)
    }

    @Test
    fun `should not be able to accept non existed notification`() {
        val request = AcceptOpponentLinkedRequest(11)

        postRequest("$baseUrl/accept", request)
            .andExpectValidationError(ValidationKeys.CANNOT_BE_LINKED)
    }

    private fun getLatestNotificationId(): Id? =
        ((getRequest("/api/notifications", "limitPerPage" to 1)
            .andExpect(status().isOk)
            .getResponse(List::class.java)[0] as LinkedHashMap<*, *>)["id"] as Int?)?.toLong()


    private fun addOpponent(saveOpponentRequest: SaveOpponentRequest): Id =
        postRequest("/api/opponents", saveOpponentRequest)
            .andExpect(status().isCreated)
            .getResponse(IdResponse::class.java).id

}
