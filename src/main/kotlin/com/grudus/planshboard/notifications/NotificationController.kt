package com.grudus.planshboard.notifications

import com.grudus.planshboard.auth.UserAuthentication
import com.grudus.planshboard.commons.Id
import com.grudus.planshboard.notifications.model.MarkAsReadRequest
import com.grudus.planshboard.notifications.model.Notification
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.format.annotation.DateTimeFormat
import org.springframework.web.bind.annotation.*
import java.time.LocalDateTime

@RestController
@RequestMapping("/api/notifications")
class NotificationController
@Autowired
constructor(
    private val notificationService: NotificationService,
    private val notificationSecurityService: NotificationSecurityService
) {
    private val log = LoggerFactory.getLogger(javaClass.simpleName)

    @GetMapping
    fun findNotifications(
        @RequestParam limitPerPage: Int,
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) @RequestParam(required = false) dateToLookAfter: LocalDateTime?
    ): List<Notification<*>> {
        return notificationService.findNotifications(limitPerPage, dateToLookAfter)
    }

    @PutMapping("mark-as-read")
    fun markNotificationsAsRead(@RequestBody request: MarkAsReadRequest, user: UserAuthentication) {
        notificationSecurityService.checkAccess(request.ids).throwWhenAccessForbidden()
        log.info("User[${user.id}] marks notifications as read", request)
        notificationService.markAsRead(request)
    }

    @PutMapping("mark-all-as-read")
    fun markAllNotificationsAsRead(user: UserAuthentication) {
        log.info("User[${user.id}] marks all notifications as read")
        notificationService.markAllAsRead()
    }

    @DeleteMapping("/{id}")
    fun deleteNotification(
        @PathVariable id: Id,
        user: UserAuthentication
    ) {
        notificationSecurityService.checkAccess(id).throwWhenAccessForbidden()
        log.info("User[${user.id}] deletes notification[${id}]")
        notificationService.delete(id)
    }
}

