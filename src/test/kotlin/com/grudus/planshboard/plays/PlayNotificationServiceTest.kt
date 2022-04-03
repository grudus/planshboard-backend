package com.grudus.planshboard.plays

import com.grudus.planshboard.boardgames.linked.LinkedBoardGameService
import com.grudus.planshboard.notifications.NotificationService
import com.grudus.planshboard.notifications.model.NotificationEventType.PLAY_ADDED
import com.grudus.planshboard.notifications.model.PlayNotification
import com.grudus.planshboard.opponents.linked.LinkedOpponentService
import com.grudus.planshboard.opponents.model.LinkedOpponentStatus
import com.grudus.planshboard.opponents.model.OpponentDto
import com.grudus.planshboard.opponents.model.UserLinkedToOpponent
import com.grudus.planshboard.plays.model.PlayResult
import com.grudus.planshboard.plays.model.SavePlayRequest
import com.grudus.planshboard.plays.notifications.PlayNotificationService
import com.grudus.planshboard.user.CurrentUserService
import com.grudus.planshboard.user.model.CurrentUser
import com.grudus.planshboard.utils.randomId
import com.grudus.planshboard.utils.randomText
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.ArgumentMatchers.anyList
import org.mockito.Mock
import org.mockito.Mockito
import org.mockito.junit.jupiter.MockitoExtension

@ExtendWith(MockitoExtension::class)
class PlayNotificationServiceTest {
    @Mock
    private lateinit var notificationService: NotificationService

    @Mock
    private lateinit var linkedOpponentService: LinkedOpponentService

    @Mock
    private lateinit var currentUserService: CurrentUserService

    @Mock
    private lateinit var linkedBoardGameService: LinkedBoardGameService

    private lateinit var playNotificationService: PlayNotificationService

    private val currentUserId by lazy { randomId() }

    @BeforeEach
    fun init() {
        playNotificationService = PlayNotificationService(
            notificationService,
            linkedOpponentService,
            currentUserService,
            linkedBoardGameService
        )
    }

    @Test
    fun `should create notifications only for opponents assigned with real users`() {
        val opponents = listOf(randomOpponentWithUser(), randomOpponentWithUser())
        val playId = randomId()
        val boardGameId = randomId()
        Mockito.`when`(linkedOpponentService.findOpponentsLinkedWithRealUsers()).thenReturn(opponents)
        Mockito.`when`(notificationService.notifyMultiple(anyList())).thenAnswer { it.getArgument(0, List::class.java) }
        Mockito.`when`(currentUserService.currentUser()).thenReturn(CurrentUser(currentUserId, "Janek"))

        val notifications = playNotificationService.notifyPlayCreated(
            SavePlayRequest(
                boardGameId, listOf(PlayResult(opponents[0].id), PlayResult(randomId())), emptyList()
            ),
            playId
        )

        assertEquals(1, notifications.size)
        assertEquals(opponents[0].linkedUser!!.userId, notifications[0].displayUserId)
        assertEquals(PLAY_ADDED, notifications[0].eventType)
        assertEquals(
            PlayNotification(currentUserId, "Janek", playId, boardGameId),
            (notifications[0].eventData as PlayNotification)
        )
    }

    @Test
    fun `should not create any notification when no opponent in created play is assigned to the real user`() {
        val playId = randomId()
        Mockito.`when`(linkedOpponentService.findOpponentsLinkedWithRealUsers())
            .thenReturn(listOf(randomOpponentWithUser()))
        Mockito.lenient().`when`(notificationService.notifyMultiple(anyList()))
            .thenAnswer { it.getArgument(0, List::class.java) }

        val notifications = playNotificationService.notifyPlayCreated(
            SavePlayRequest(
                randomId(), listOf(PlayResult(randomId()), PlayResult(randomId())), emptyList()
            ),
            playId
        )

        assertTrue(notifications.isEmpty())
    }

    private fun randomOpponentWithUser() =
        OpponentDto(
            randomId(),
            randomText(),
            UserLinkedToOpponent(randomId(), randomText(), LinkedOpponentStatus.ENABLED)
        )
}
