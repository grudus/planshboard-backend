package com.grudus.planshboard.notifications

import com.grudus.planshboard.notifications.model.Notification
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.format.annotation.DateTimeFormat
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.time.LocalDateTime

@RestController
@RequestMapping("/api/notifications")
class NotificationController
@Autowired
constructor(private val notificationService: NotificationService) {

    @GetMapping
    fun findNotifications(@RequestParam limitPerPage: Int,
                          @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) @RequestParam(required = false) dateToLookAfter: LocalDateTime?): List<Notification<*>> {
        return notificationService.findNotifications(limitPerPage, dateToLookAfter)
    }
}
