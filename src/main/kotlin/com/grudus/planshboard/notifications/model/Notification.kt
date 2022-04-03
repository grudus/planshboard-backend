package com.grudus.planshboard.notifications.model

import com.grudus.planshboard.commons.Id
import java.time.LocalDateTime
import java.time.LocalDateTime.now

data class Notification<T>(
    val id: Id? = null,
    val displayUserId: Id,
    val createdAt: LocalDateTime = now(),
    val displayedAt: LocalDateTime? = null,
    val eventType: NotificationEventType,
    val eventData: T,
    val possibleActions: List<String>,
)
