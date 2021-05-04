package com.grudus.planshboard.notifications

import com.grudus.planshboard.commons.Id
import com.grudus.planshboard.messagesender.MessageSender
import com.grudus.planshboard.notifications.model.MarkAsReadRequest
import com.grudus.planshboard.notifications.model.Notification
import com.grudus.planshboard.user.CurrentUserService
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import java.time.LocalDateTime.now

@Service
class NotificationService
@Autowired
constructor(
    private val notificationDao: NotificationDao,
    private val messageSender: MessageSender,
    private val currentUserService: CurrentUserService
) {
    private val log = LoggerFactory.getLogger(javaClass.simpleName)


    fun notifyMultiple(notifications: List<Notification<*>>): List<Notification<*>> {
        log.info("About to save multiple notifications $notifications")

        val savedNotifications = notificationDao.saveMultiple(notifications)
        messageSender.sendNotificationMessages(savedNotifications)
        return savedNotifications
    }

    @Suppress("UNCHECKED_CAST")
    fun <T> notify(notification: Notification<T>): Notification<T> =
        notifyMultiple(listOf(notification)).first() as Notification<T>


    fun findNotifications(limitPerPage: Int, dateToLookAfter: LocalDateTime?): List<Notification<*>> {
        return notificationDao.findNotificationsForUser(
            currentUserService.currentUserId(),
            limitPerPage,
            dateToLookAfter ?: now()
        )
    }

    fun <T> findNotificationData(id: Id, aClass: Class<T>): T? =
        findNotification(id, aClass)?.eventData

    @Suppress("UNCHECKED_CAST")
    fun <T> findNotification(id: Id, aClass: Class<T>): Notification<T>? {
        val notification: Notification<*> = notificationDao.findById(id) ?: return null

        if (!aClass.isAssignableFrom(notification.eventType.eventDataClass)) {
            throw ClassCastException("Cannot cast ${notification.eventType.eventDataClass} to $aClass")
        }

        return notification as Notification<T>
    }


    fun updatePossibleActions(notificationId: Id, possibleActions: List<String>) {
        notificationDao.updatePossibleActions(notificationId, possibleActions)
    }

    fun markAsRead(request: MarkAsReadRequest) {
        notificationDao.markAsRead(request.ids)
    }

    fun markAllAsRead() {
        notificationDao.markAllAsRead(currentUserService.currentUserId())
    }

    fun delete(id: Id) = notificationDao.delete(id)

}
