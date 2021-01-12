package com.grudus.planshboard.notifications

import com.grudus.planshboard.AuthenticatedControllerTest
import com.grudus.planshboard.notifications.model.MarkAsReadRequest
import com.grudus.planshboard.utils.TestUtils.hasSize
import org.hamcrest.Matchers.notNullValue
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import java.time.LocalDateTime

class NotificationControllerTest
@Autowired
constructor(private val dataProvider: NotificationTestDataProvider) : AuthenticatedControllerTest() {
    private val baseUrl = "/api/notifications"

    @Test
    fun `should return empty list when no notifications`() {
        getRequest(baseUrl, "limitPerPage" to 10)
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.[*]", hasSize(0)))

    }

    @Test
    fun `should return all entries when number of notifications smaller than limit`() {
        dataProvider.saveRandomNotifications(4, userId = authentication.id)

        getRequest(baseUrl, "limitPerPage" to 10)
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.[*]", hasSize(4)))
    }

    @Test
    fun `should return notifications limited to param`() {
        dataProvider.saveRandomNotifications(40, userId = authentication.id)

        getRequest(baseUrl, "limitPerPage" to 10)
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.[*]", hasSize(10)))
    }

    @Test
    fun `should return notifications after specified date`() {
        val now = LocalDateTime.now()
        val notifications = (0 until 10).flatMap { i ->
            dataProvider.saveRandomNotifications(
                1,
                userId = authentication.id,
                createdAt = now.minusHours(i.toLong())
            )
        }

        getRequest(baseUrl, "limitPerPage" to 10, "dateToLookAfter" to now.minusHours(5))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.[*]", hasSize(4)))
            .andExpect(jsonPath("$.[0].id").value(notifications[6].id.toString()))
            .andExpect(jsonPath("$.[1].id").value(notifications[7].id.toString()))
            .andExpect(jsonPath("$.[2].id").value(notifications[8].id.toString()))
            .andExpect(jsonPath("$.[3].id").value(notifications[9].id.toString()))
    }

    @Test
    fun `should mark notifications as read`() {
        val notifications = dataProvider.saveRandomNotifications(2, userId = authentication.id)

        putRequest("$baseUrl/mark-as-read", MarkAsReadRequest(notifications.map { it.id!! }))
            .andExpect(status().isOk)

        getRequest(baseUrl, "limitPerPage" to 10)
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.[*].displayedAt", notNullValue()))
    }

    @Test
    fun `should not be able to mark as read notifications from another user`() {
        val notifications = dataProvider.saveRandomNotifications(2, userId = authentication.id)

        setupAuthContextForAnotherUser()

        putRequest("$baseUrl/mark-as-read", MarkAsReadRequest(notifications.map { it.id!! }))
            .andExpect(status().isForbidden)
    }


    @Test
    fun `should mark all notifications as read`() {
        dataProvider.saveRandomNotifications(2, userId = authentication.id)
        dataProvider.saveRandomNotifications(6, userId = authentication.id)

        putRequest("$baseUrl/mark-all-as-read", Unit)
            .andExpect(status().isOk)

        getRequest(baseUrl, "limitPerPage" to 10)
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.[*].displayedAt", notNullValue()))
    }

    @Test
    fun `should mark all notifications as read only for given user`() {
        dataProvider.saveRandomNotifications(2, userId = authentication.id)

        runWithAnotherUserContext {
            putRequest("$baseUrl/mark-all-as-read", Unit)
                .andExpect(status().isOk)
        }

        getRequest(baseUrl, "limitPerPage" to 10)
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.[*].displayedAt", notNullValue()))
    }

    @Test
    fun `should delete notification`() {
        dataProvider.saveRandomNotifications(2, userId = authentication.id)
        val idToDelete = dataProvider.saveRandomNotification(userId = authentication.id).id!!

        deleteRequest("$baseUrl/$idToDelete")
            .andExpect(status().isOk)

        getRequest(baseUrl, "limitPerPage" to 10)
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.[*]", hasSize(2)))
    }

    @Test
    fun `should not be able to delete someone else's notification`() {
        dataProvider.saveRandomNotifications(2, userId = authentication.id)
        val idToDelete = dataProvider.saveRandomNotification(userId = authentication.id).id!!

        runWithAnotherUserContext {
            deleteRequest("$baseUrl/$idToDelete")
                .andExpect(status().isForbidden)
        }

        getRequest(baseUrl, "limitPerPage" to 10)
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.[*]", hasSize(3)))
    }
}
