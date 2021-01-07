package com.grudus.planshboard.notifications

import com.grudus.planshboard.AbstractDatabaseTest
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import java.time.LocalDateTime

class NotificationDaoTest
@Autowired
constructor(
    private val notificationDao: NotificationDao,
    private val dataProvider: NotificationTestDataProvider
) : AbstractDatabaseTest() {

    @Test
    fun `should save multiple notifications and return their ids`() {
        val now = LocalDateTime.now()
        val notifications =
            (0 until 4).flatMap { i -> dataProvider.saveRandomNotifications(1, createdAt = now.minusMinutes(i.toLong()), userId = firstUserId) }

        notifications.forEach { notification ->
            val result = notificationDao.findNotificationsForUser(firstUserId, 1, dateToLookAfter = notification.createdAt.plusSeconds(1))[0]

            assertEquals(result.id, notification.id)
            assertEquals(result.createdAt, notification.createdAt)
            assertEquals(result.eventData, notification.eventData)
        }
    }

    @Test
    fun `should find all notifications for user when no date specified`() {
        dataProvider.saveRandomNotifications(10, userId = firstUserId)
        dataProvider.saveRandomNotifications(4, userId = addUser())

        val notifications = notificationDao.findNotificationsForUser(firstUserId, limit = 100)

        assertEquals(10, notifications.size)
    }

    @Test
    fun `should limit notifications found for user`() {
        dataProvider.saveRandomNotifications(100, userId = firstUserId)

        val notifications = notificationDao.findNotificationsForUser(firstUserId, limit = 4)

        assertEquals(4, notifications.size)
    }

    @Test
    fun `should allow to seek notifications by date`() {
        val notification1 = dataProvider.saveRandomNotifications(1, createdAt = LocalDateTime.now().minusSeconds(100), userId = firstUserId)[0]
        val notification2 = dataProvider.saveRandomNotifications(1, createdAt = LocalDateTime.now().minusSeconds(300), userId = firstUserId)[0]
        val notification3 = dataProvider.saveRandomNotifications(1, createdAt = LocalDateTime.now().minusSeconds(50), userId = firstUserId)[0]

        val notifications = notificationDao.findNotificationsForUser(
            firstUserId,
            limit = 200,
            dateToLookAfter = notification3.createdAt
        )

        assertEquals(2, notifications.size)
        assertEquals(notification1.id, notifications[0].id)
        assertEquals(notification2.id, notifications[1].id)
    }

    @Test
    fun `should return empty list when cannot find any more notifications`() {
        dataProvider.saveRandomNotifications(1, createdAt = LocalDateTime.now().minusSeconds(100), userId = firstUserId)[0]
        val notification = dataProvider.saveRandomNotifications(1, createdAt = LocalDateTime.now().minusSeconds(300), userId = firstUserId)[0]
        dataProvider.saveRandomNotifications(1, createdAt = LocalDateTime.now().minusSeconds(50), userId = firstUserId)[0]

        val notifications = notificationDao.findNotificationsForUser(
            firstUserId,
            limit = 200,
            dateToLookAfter = notification.createdAt
        )

        assertTrue(notifications.isEmpty())
    }
}
