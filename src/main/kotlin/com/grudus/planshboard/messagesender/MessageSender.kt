package com.grudus.planshboard.messagesender

import com.grudus.planshboard.notifications.model.Notification
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service

@Service
class MessageSender {
    private val log = LoggerFactory.getLogger(javaClass.simpleName)

    fun sendNotificationMessages(notifications: List<Notification<*>>) {
        log.info("About to send over websocket: $notifications")
    }
}
