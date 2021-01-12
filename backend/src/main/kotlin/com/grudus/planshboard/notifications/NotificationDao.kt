package com.grudus.planshboard.notifications

import com.fasterxml.jackson.databind.ObjectMapper
import com.grudus.planshboard.commons.CurrentTimeProvider
import com.grudus.planshboard.commons.Id
import com.grudus.planshboard.commons.jooq.JooqCommons
import com.grudus.planshboard.commons.security.AccessToResourceChecker
import com.grudus.planshboard.enums.NotificationEventType
import com.grudus.planshboard.notifications.model.Notification
import com.grudus.planshboard.tables.Notifications.NOTIFICATIONS
import com.grudus.planshboard.tables.records.NotificationsRecord
import org.jooq.Condition
import org.jooq.DSLContext
import org.jooq.JSON
import org.jooq.RecordMapper
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Repository
import java.time.LocalDateTime

@Repository
class NotificationDao
@Autowired
constructor(
    private val dsl: DSLContext,
    private val objectMapper: ObjectMapper,
    private val currentTimeProvider: CurrentTimeProvider
) : AccessToResourceChecker {

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

    fun findNotificationsForUser(
        userId: Id,
        limit: Int,
        dateToLookAfter: LocalDateTime = LocalDateTime.now()
    ): List<Notification<*>> =
        dsl.selectFrom(NOTIFICATIONS)
            .where(NOTIFICATIONS.DISPLAY_USER_ID.eq(userId))
            .orderBy(NOTIFICATIONS.CREATED_AT.desc())
            .seek(dateToLookAfter)
            .limit(limit)
            .fetch(intoNotification())


    override fun canBeAccessedByUser(userId: Id, entityIds: List<Id>): Boolean =
        dsl.fetchCount(
            dsl.select(NOTIFICATIONS.ID)
                .from(NOTIFICATIONS)
                .where(NOTIFICATIONS.DISPLAY_USER_ID.eq(userId))
                .and(NOTIFICATIONS.ID.`in`(entityIds))
        ) == entityIds.size


    private fun intoNotification(): RecordMapper<NotificationsRecord, Notification<*>> = RecordMapper {
        val eventType = com.grudus.planshboard.notifications.model.NotificationEventType.valueOf(it.eventType.name)
        Notification(
            it.id,
            it.displayUserId,
            it.createdAt,
            it.displayedAt,
            eventType,
            objectMapper.readValue(it.eventData.data(), eventType.eventDataClass)
        )
    }

    fun delete(id: Id) =
        dsl.deleteFrom(NOTIFICATIONS)
            .where(NOTIFICATIONS.ID.eq(id))
            .execute()

    fun markAsRead(ids: List<Id>) = updateMarkAs(NOTIFICATIONS.ID.`in`(ids), currentTimeProvider.now())
    fun markAllAsRead(userId: Id) = updateMarkAs(NOTIFICATIONS.DISPLAY_USER_ID.eq(userId), currentTimeProvider.now())

    private fun updateMarkAs(condition: Condition, value: LocalDateTime?) =
        dsl.update(NOTIFICATIONS)
            .set(NOTIFICATIONS.DISPLAYED_AT, value)
            .where(condition)
            .execute()

}
