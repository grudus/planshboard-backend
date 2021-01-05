package com.grudus.planshboard.notifications

import com.fasterxml.jackson.databind.ObjectMapper
import com.grudus.planshboard.commons.jooq.JooqCommons
import com.grudus.planshboard.enums.NotificationEventType
import com.grudus.planshboard.notifications.model.Notification
import com.grudus.planshboard.tables.Notifications.NOTIFICATIONS
import com.grudus.planshboard.tables.records.NotificationsRecord
import org.jooq.DSLContext
import org.jooq.JSON
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Repository

@Repository
class NotificationDao
@Autowired
constructor(
    private val dsl: DSLContext,
    private val objectMapper: ObjectMapper
) {

    fun saveMultiple(notifications: List<Notification<*>>): List<Notification<*>> {
        val records = notifications.map {
            NotificationsRecord(
                null,
                it.displayUserId,
                it.createdAt,
                it.displayedAt,
                NotificationEventType.valueOf(it.eventType.name),
                JSON.valueOf(objectMapper.writeValueAsString(it.eventData))
            )
        }
        val ids = JooqCommons.insertMultipleAndReturnIds(dsl, NOTIFICATIONS, records)

        return notifications.mapIndexed { index: Int, notification: Notification<*> ->
            notification.copy(id = ids[index])
        }
    }
}
