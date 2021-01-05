package com.grudus.planshboard.notifications

import com.grudus.planshboard.messagesender.MessageSender
import com.grudus.planshboard.notifications.model.Notification
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class NotificationService
@Autowired
constructor(
    private val notificationDao: NotificationDao,
    private val messageSender: MessageSender
) {
    private val log = LoggerFactory.getLogger(javaClass.simpleName)


    fun notifyMultiple(notifications: List<Notification<*>>): List<Notification<*>> {
        log.info("About to save multiple notifications $notifications")

        val savedNotifications = notificationDao.saveMultiple(notifications)
        messageSender.sendNotificationMessages(savedNotifications)
        return savedNotifications
    }
}
