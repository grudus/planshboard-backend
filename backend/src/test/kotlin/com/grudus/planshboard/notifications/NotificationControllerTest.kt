package com.grudus.planshboard.notifications

import com.grudus.planshboard.AuthenticatedControllerTest
import com.grudus.planshboard.utils.TestUtils.hasSize
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
            .debug()
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.[*]", hasSize(4)))
            .andExpect(jsonPath("$.[0].id").value(notifications[6].id.toString()))
            .andExpect(jsonPath("$.[1].id").value(notifications[7].id.toString()))
            .andExpect(jsonPath("$.[2].id").value(notifications[8].id.toString()))
            .andExpect(jsonPath("$.[3].id").value(notifications[9].id.toString()))
    }
}
