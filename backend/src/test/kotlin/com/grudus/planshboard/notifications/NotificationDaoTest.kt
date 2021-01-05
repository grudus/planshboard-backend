package com.grudus.planshboard.notifications

import com.fasterxml.jackson.databind.ObjectMapper
import com.grudus.planshboard.AbstractDatabaseTest
import com.grudus.planshboard.notifications.model.Notification
import com.grudus.planshboard.notifications.model.NotificationEventType
import com.grudus.planshboard.tables.Notifications.NOTIFICATIONS
import com.grudus.planshboard.utils.randomText
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import java.time.LocalDateTime

class NotificationDaoTest
@Autowired
constructor(
    private val notificationDao: NotificationDao,
    private val objectMapper: ObjectMapper
) : AbstractDatabaseTest() {

    @Test
    fun `should save multiple notifications and return their ids`() {
        val notifications = (0 until 4).map {
            Notification(
                displayUserId = firstUserId,
                createdAt = LocalDateTime.now(),
                eventType = NotificationEventType.PLAY_ADDED,
                eventData = randomText()
            )
        }

        val savedNotifications = notificationDao.saveMultiple(notifications)

        savedNotifications.forEach { notification ->
            // TODO use NotificationDao.getById() instead of direct sql query
            val result = dsl.selectFrom(NOTIFICATIONS).where(NOTIFICATIONS.ID.eq(notification.id)).fetchOne()

            assertEquals(result.id, notification.id)
            assertEquals(result.createdAt, notification.createdAt)
            assertEquals(objectMapper.readValue(result.eventData.data(), String::class.java), notification.eventData)
        }
    }

}
