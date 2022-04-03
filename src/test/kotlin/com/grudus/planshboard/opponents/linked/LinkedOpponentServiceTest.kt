package com.grudus.planshboard.opponents.linked

import com.grudus.planshboard.opponents.model.LinkedOpponentStatus
import com.grudus.planshboard.opponents.notifications.OpponentNotificationService
import com.grudus.planshboard.user.CurrentUserService
import com.grudus.planshboard.utils.TestUtils.anyId
import com.grudus.planshboard.utils.randomId
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mock
import org.mockito.Mockito.*
import org.mockito.junit.jupiter.MockitoExtension

@ExtendWith(MockitoExtension::class)
class LinkedOpponentServiceTest {
    @Mock
    private lateinit var linkedOpponentDao: LinkedOpponentDao
    @Mock
    private lateinit var currentUserService: CurrentUserService
    @Mock
    private lateinit var opponentNotificationService: OpponentNotificationService

    private lateinit var linkedOpponentService: LinkedOpponentService

    @BeforeEach
    fun init() {
        linkedOpponentService = LinkedOpponentService(linkedOpponentDao, currentUserService, opponentNotificationService)
    }

    @Test
    fun `should notify users only when status is waiting for confirmation`() {
        linkedOpponentService.linkWithUser(randomId(), randomId(), LinkedOpponentStatus.WAITING_FOR_CONFIRMATION)
        verify(opponentNotificationService).notifyOpponentLinked(anyId(), anyId())

        reset(opponentNotificationService)

        linkedOpponentService.linkWithUser(randomId(), randomId(), LinkedOpponentStatus.DISABLED)
        verify(opponentNotificationService, never()).notifyOpponentLinked(anyId(), anyId())
    }
}
