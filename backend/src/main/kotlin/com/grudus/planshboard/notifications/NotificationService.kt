package com.grudus.planshboard.notifications

import com.grudus.planshboard.messagesender.MessageSender
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

    fun findNotifications(limitPerPage: Int, dateToLookAfter: LocalDateTime?): List<Notification<*>> {
        return notificationDao.findNotificationsForUser(currentUserService.currentUserId(), limitPerPage, dateToLookAfter ?: now())
    }
}
