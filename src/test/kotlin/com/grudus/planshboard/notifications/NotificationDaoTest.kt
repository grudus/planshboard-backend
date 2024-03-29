package com.grudus.planshboard.notifications

import com.grudus.planshboard.AbstractDatabaseTest
import com.grudus.planshboard.utils.randomId
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import java.time.LocalDateTime
import java.time.temporal.ChronoUnit
import java.time.temporal.TemporalUnit
import java.util.Calendar
import org.apache.commons.lang3.time.CalendarUtils
import org.apache.commons.lang3.time.DateUtils

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
            (0 until 4).map { i ->
                dataProvider.saveRandomNotification(
                    createdAt = now.minusMinutes(i.toLong()),
                    userId = firstUserId
                )
            }

        notifications.forEach { notification ->
            val result = notificationDao.findNotificationsForUser(
                firstUserId,
                1,
                dateToLookAfter = notification.createdAt.plusSeconds(1)
            )[0]

            assertEquals(result.id, notification.id)
            assertEquals(result.eventData, notification.eventData)
            assertEquals(
                result.createdAt.truncatedTo(ChronoUnit.SECONDS),
                notification.createdAt.truncatedTo(ChronoUnit.SECONDS)
            )
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
        val notification1 = dataProvider.saveRandomNotification(
            createdAt = LocalDateTime.now().minusSeconds(100),
            userId = firstUserId
        )
        val notification2 = dataProvider.saveRandomNotification(
            createdAt = LocalDateTime.now().minusSeconds(300),
            userId = firstUserId
        )
        val notification3 = dataProvider.saveRandomNotification(
            createdAt = LocalDateTime.now().minusSeconds(50),
            userId = firstUserId
        )

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
        dataProvider.saveRandomNotification(
            createdAt = LocalDateTime.now().minusSeconds(100),
            userId = firstUserId
        )
        val notification = dataProvider.saveRandomNotification(
            createdAt = LocalDateTime.now().minusSeconds(300),
            userId = firstUserId
        )
        dataProvider.saveRandomNotification(
            createdAt = LocalDateTime.now().minusSeconds(50),
            userId = firstUserId
        )

        val notifications = notificationDao.findNotificationsForUser(
            firstUserId,
            limit = 200,
            dateToLookAfter = notification.createdAt
        )

        assertTrue(notifications.isEmpty())
    }

    @Test
    fun `should allow to access notifications displayed for given user`() {
        val notifications = dataProvider.saveRandomNotifications(10, userId = firstUserId)
        dataProvider.saveRandomNotifications(5, userId = addUser())

        val hasAccess = notificationDao.canBeAccessedByUser(firstUserId, notifications.map { it.id!! })

        assertTrue(hasAccess)
    }

    @Test
    fun `should detect that user has no access to the notifications if any of them should be displayed by another user`() {
        val notifications = dataProvider.saveRandomNotifications(10, userId = firstUserId)
        val notifications2 = dataProvider.saveRandomNotifications(5, userId = addUser())

        val hasAccess =
            notificationDao.canBeAccessedByUser(firstUserId, (notifications + notifications2).map { it.id!! })

        assertFalse(hasAccess)
    }

    @Test
    fun `should detect that user has no access to the notifications if all of them should be displayed by another user`() {
        val notifications = dataProvider.saveRandomNotifications(10, userId = firstUserId)

        val hasAccess = notificationDao.canBeAccessedByUser(addUser(), notifications.map { it.id!! })

        assertFalse(hasAccess)
    }

    @Test
    fun `should mark notifications as read and change displayed at date`() {
        val notifications = dataProvider.saveRandomNotifications(3, userId = firstUserId)

        notificationDao.markAsRead(notifications.take(1).map { it.id!! })

        val dbNotifications = notificationDao.findNotificationsForUser(firstUserId, 10).sortedBy { it.id }

        assertNotNull(dbNotifications[0].displayedAt)
        assertNull(dbNotifications[1].displayedAt)
        assertNull(dbNotifications[2].displayedAt)
    }

    @Test
    fun `should do nothing when marking as read non existed notifications`() {
        dataProvider.saveRandomNotifications(3, userId = firstUserId)
        notificationDao.markAsRead(listOf(randomId(), randomId()))

        val dbNotifications = notificationDao.findNotificationsForUser(firstUserId, 10)

        dbNotifications.forEach { not -> assertNull(not.displayedAt, "Invalid displayedAt on $not") }
    }

    @Test
    fun `should be able to mark as read notifications from different users`() {
        val user2 = addUser()
        val notifications1 = dataProvider.saveRandomNotifications(2, userId = firstUserId).map { it.id!! }
        val notifications2 = dataProvider.saveRandomNotifications(2, userId = user2).map { it.id!! }

        notificationDao.markAsRead(notifications1 + notifications2)

        val dbNotifications1 = notificationDao.findNotificationsForUser(firstUserId, 10)
        val dbNotifications2 = notificationDao.findNotificationsForUser(firstUserId, 10)

        (dbNotifications1 + dbNotifications2).forEach { not ->
            assertNotNull(
                not.displayedAt,
                "Invalid displayedAt on $not"
            )
        }
    }

    @Test
    fun `should mark all notifications as read`() {
        dataProvider.saveRandomNotifications(3, userId = firstUserId)
        notificationDao.markAllAsRead(firstUserId)

        val dbNotifications = notificationDao.findNotificationsForUser(firstUserId, 10)

        dbNotifications.forEach { not -> assertNotNull(not.displayedAt, "Invalid displayedAt on $not") }
    }

    @Test
    fun `should mark all notifications as read only for given user`() {
        dataProvider.saveRandomNotifications(3, userId = firstUserId)
        notificationDao.markAllAsRead(addUser())

        val dbNotifications = notificationDao.findNotificationsForUser(firstUserId, 10)

        dbNotifications.forEach { not -> assertNull(not.displayedAt, "Invalid displayedAt on $not") }
    }

    @Test
    fun `should delete notification`() {
        val idToDelete = dataProvider.saveRandomNotification(userId = firstUserId).id!!
        dataProvider.saveRandomNotifications(3, userId = firstUserId)

        notificationDao.delete(idToDelete)

        val dbNotifications = notificationDao.findNotificationsForUser(firstUserId, 10)

        assertEquals(3, dbNotifications.size)
        dbNotifications.forEach { not ->
            assertTrue(not.id != idToDelete, "Found deleted notification $not")
        }
    }

    @Test
    fun `should do nothing when deleting non existing notification`() {
        dataProvider.saveRandomNotifications(3, userId = firstUserId)

        notificationDao.delete(randomId())

        val dbNotifications = notificationDao.findNotificationsForUser(firstUserId, 10)

        assertEquals(3, dbNotifications.size)
    }

    @Test
    fun `should find by id`() {
        dataProvider.saveRandomNotifications(3, userId = firstUserId)
        val notification = dataProvider.saveRandomNotification(firstUserId)
        dataProvider.saveRandomNotifications(3, userId = firstUserId)

        val dbNotification = notificationDao.findById(notification.id!!)

        assertNotNull(dbNotification)
        assertEquals(notification.id!!, dbNotification!!.id)
        assertEquals(notification.eventType, dbNotification.eventType)
        assertEquals(notification.eventData, dbNotification.eventData)
    }

    @Test
    fun `should return null when cannot find by id`() {
        dataProvider.saveRandomNotifications(3, userId = firstUserId)

        val dbNotification = notificationDao.findById(randomId())

        assertNull(dbNotification)
    }

    @Test
    fun `should be able to update possible actions`() {
        val id = dataProvider.saveRandomNotification(userId = firstUserId, possibleActions = listOf("ACTION")).id!!
        notificationDao.updatePossibleActions(id, listOf("REACTION_1", "REACTION_2"))

        val dbNotification = notificationDao.findById(id)!!

        assertEquals(2, dbNotification.possibleActions.size)
        assertTrue(dbNotification.possibleActions.containsAll(listOf("REACTION_1", "REACTION_2")))
    }

    @Test
    fun `should be able to set empty possible actions`() {
        val id = dataProvider.saveRandomNotification(userId = firstUserId, possibleActions = listOf("ACTION")).id!!
        notificationDao.updatePossibleActions(id, emptyList())

        val dbNotification = notificationDao.findById(id)!!

        assertTrue(dbNotification.possibleActions.isEmpty())
    }
}
