package com.grudus.planshboard.plays.notifications

import com.grudus.planshboard.commons.validation.ValidationKeys.CANNOT_PARTICIPE_IN_PLAY
import com.grudus.planshboard.notifications.NotificationService
import com.grudus.planshboard.notifications.model.PlayNotification
import com.grudus.planshboard.plays.PlayService
import com.grudus.planshboard.user.CurrentUserService
import com.grudus.planshboard.utils.TestUtils.anyClass
import com.grudus.planshboard.utils.randomId
import com.grudus.planshboard.utils.randomText
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.ArgumentMatchers.anyLong
import org.mockito.Mock
import org.mockito.Mockito
import org.mockito.junit.jupiter.MockitoExtension

@ExtendWith(MockitoExtension::class)
class AcceptPlayParticipationRequestValidatorTest {
    @Mock
    private lateinit var playService: PlayService

    @Mock
    private lateinit var currentUserService: CurrentUserService

    @Mock
    private lateinit var notificationService: NotificationService

    private lateinit var validator: AcceptPlayParticipationRequestValidator

    @BeforeEach
    fun init() {
        validator = AcceptPlayParticipationRequestValidator(playService, currentUserService, notificationService)
    }

    @Test
    fun `should validate correctly`() {
        Mockito.`when`(currentUserService.currentUserId()).thenReturn(randomId())
        Mockito.`when`(playService.userParticipatedInPlay(anyLong(), anyLong())).thenReturn(true)
        Mockito.`when`(notificationService.findNotificationData(anyLong(), anyClass(PlayNotification::class.java))).thenReturn(randomNotification())

        val validationResult = validator.validate(AcceptPlayParticipationRequest(randomId()))

        assertTrue(validationResult.isSuccess())
    }

    @Test
    fun `should not pass validation when user doesn't participated in play`() {
        Mockito.`when`(notificationService.findNotificationData(anyLong(), anyClass(PlayNotification::class.java))).thenReturn(null)

        val validationResult = validator.validate(AcceptPlayParticipationRequest(randomId()))

        assertFalse(validationResult.isSuccess())
        assertEquals(CANNOT_PARTICIPE_IN_PLAY, validationResult.getError())
    }

    private fun randomNotification() = PlayNotification(
        randomId(), randomText(), randomId(), randomId()
    )

}
