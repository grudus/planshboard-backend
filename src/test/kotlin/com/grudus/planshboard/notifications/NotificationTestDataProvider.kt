package com.grudus.planshboard.notifications

import com.grudus.planshboard.commons.Id
import com.grudus.planshboard.notifications.model.Notification
import com.grudus.planshboard.notifications.model.NotificationEventType
import com.grudus.planshboard.notifications.model.PlayNotification
import com.grudus.planshboard.utils.randomId
import com.grudus.planshboard.utils.randomText
import org.springframework.stereotype.Service
import java.time.LocalDateTime

@Service
class NotificationTestDataProvider
constructor(private val notificationDao: NotificationDao) {


    fun saveRandomNotifications(
        n: Int,
        userId: Id,
        createdAt: LocalDateTime = LocalDateTime.now(),
        possibleActions: List<String> = emptyList()
    ): List<Notification<*>> {
        val notifications = (0 until n).map {
            Notification(
                displayUserId = userId,
                createdAt = createdAt,
                eventType = NotificationEventType.PLAY_ADDED,
                eventData = PlayNotification(randomId(), randomText(), randomId(), randomId()),
                possibleActions = possibleActions
            )
        }
        return notificationDao.saveMultiple(notifications)
    }

    fun saveRandomNotification(
        userId: Id,
        createdAt: LocalDateTime = LocalDateTime.now(),
        possibleActions: List<String> = emptyList()
    ): Notification<*> {
        return saveRandomNotifications(1, userId, createdAt, possibleActions)[0]
    }
}

