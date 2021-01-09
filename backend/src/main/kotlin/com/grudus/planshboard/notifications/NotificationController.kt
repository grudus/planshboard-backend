package com.grudus.planshboard.notifications

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
    fun markNotificationsAsRead(@RequestBody request: MarkAsReadRequest) {
        notificationSecurityService.checkAccess(request.ids).throwWhenAccessForbidden()
        log.info("Marking notifications as read", request)
    }
}
