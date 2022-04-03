package com.grudus.planshboard.opponents.notifications

import com.grudus.planshboard.notifications.NotificationService
import com.grudus.planshboard.notifications.model.NotificationEventType
import com.grudus.planshboard.notifications.model.OpponentLinkedNotification
import com.grudus.planshboard.user.CurrentUserService
import com.grudus.planshboard.user.model.CurrentUser
import com.grudus.planshboard.utils.TestUtils.anyNotification
import com.grudus.planshboard.utils.randomId
import com.grudus.planshboard.utils.randomText
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mock
import org.mockito.Mockito
import org.mockito.junit.jupiter.MockitoExtension

@ExtendWith(MockitoExtension::class)
class OpponentNotificationServiceTest {
    @Mock
    private lateinit var notificationService: NotificationService

    @Mock
    private lateinit var currentUserService: CurrentUserService

    private lateinit var opponentNotificationService: OpponentNotificationService

    @BeforeEach
    fun init() {
        opponentNotificationService = OpponentNotificationService(notificationService, currentUserService)
    }

    @Test
    fun `should create valid notification for linked opponent`() {
        val currentUser = CurrentUser(randomId(), randomText())
        Mockito.`when`(currentUserService.currentUser()).thenReturn(currentUser)
        Mockito.`when`(notificationService.notify(anyNotification(OpponentLinkedNotification::class.java)))
            .thenAnswer { invoc -> invoc.getArgument(0) }

        val notification = opponentNotificationService.notifyOpponentLinked(11, 33)

        assertEquals(33, notification.displayUserId)
        assertEquals(NotificationEventType.OPPONENT_LINKED, notification.eventType)
        assertEquals(11, notification.eventData.linkedOpponentId)
        assertEquals(currentUser.username, notification.eventData.creatorDisplayName)
        assertEquals(currentUser.id, notification.eventData.creatorId)
    }

}
