package com.grudus.planshboard.opponents.notifications

import com.grudus.planshboard.commons.Id
import com.grudus.planshboard.commons.validation.ValidationKeys
import com.grudus.planshboard.notifications.NotificationService
import com.grudus.planshboard.notifications.model.OpponentLinkedNotification
import com.grudus.planshboard.opponents.OpponentService
import com.grudus.planshboard.opponents.linked.LinkedOpponentService
import com.grudus.planshboard.opponents.model.LinkedOpponentStatus
import com.grudus.planshboard.opponents.model.LinkedOpponentStatus.ENABLED
import com.grudus.planshboard.opponents.model.LinkedOpponentStatus.WAITING_FOR_CONFIRMATION
import com.grudus.planshboard.opponents.model.OpponentDto
import com.grudus.planshboard.opponents.model.UserLinkedToOpponent
import com.grudus.planshboard.user.CurrentUserService
import com.grudus.planshboard.utils.TestUtils.anyClass
import com.grudus.planshboard.utils.TestUtils.anyId
import com.grudus.planshboard.utils.randomId
import com.grudus.planshboard.utils.randomText
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.ArgumentMatchers.anyString
import org.mockito.Mock
import org.mockito.Mockito
import org.mockito.junit.jupiter.MockitoExtension

@ExtendWith(MockitoExtension::class)
class AcceptOpponentLinkedRequestValidatorTest {
    @Mock
    private lateinit var notificationService: NotificationService

    @Mock
    private lateinit var opponentService: OpponentService

    @Mock
    private lateinit var linkedOpponentService: LinkedOpponentService

    @Mock
    private lateinit var currentUserService: CurrentUserService

    private lateinit var validator: AcceptOpponentLinkedRequestValidator

    @BeforeEach
    fun init() {
        validator = AcceptOpponentLinkedRequestValidator(notificationService,
            opponentService,
            linkedOpponentService,
            currentUserService)
    }

    @Test
    fun `should validate properly`() {
        val currentUserId = randomId()
        Mockito.`when`(currentUserService.currentUserId()).thenReturn(currentUserId)
        Mockito.`when`(
            notificationService.findNotificationData(anyId(), anyClass(OpponentLinkedNotification::class.java))
        ).thenReturn(OpponentLinkedNotification(randomId(), randomText(), randomId()))
        Mockito.`when`(opponentService.findById(anyId())).thenReturn(randomOpponent(currentUserId))

        val validationResult = validator.validate(randomRequest())

        assertTrue(validationResult.isSuccess())
    }


    @Test
    fun `shouldn't validate when cannot find notification`() {
        Mockito.`when`(
            notificationService.findNotificationData(anyId(), anyClass(OpponentLinkedNotification::class.java))
        ).thenReturn(null)

        val validationResult = validator.validate(randomRequest())

        assertFalse(validationResult.isSuccess())
        assertEquals(ValidationKeys.CANNOT_BE_LINKED, validationResult.getError())
    }

    @Test
    fun `shouldn't validate when cannot find opponent`() {
        Mockito.`when`(
            notificationService.findNotificationData(anyId(), anyClass(OpponentLinkedNotification::class.java))
        ).thenReturn(OpponentLinkedNotification(randomId(), randomText(), randomId()))
        Mockito.`when`(opponentService.findById(anyId())).thenReturn(null)

        val validationResult = validator.validate(randomRequest())

        assertFalse(validationResult.isSuccess())
        assertEquals(ValidationKeys.CANNOT_BE_LINKED, validationResult.getError())
    }

    @Test
    fun `shouldn't validate when opponent is linked with different user`() {
        val currentUserId = randomId()
        Mockito.`when`(
            notificationService.findNotificationData(anyId(), anyClass(OpponentLinkedNotification::class.java))
        ).thenReturn(OpponentLinkedNotification(randomId(), randomText(), randomId()))

        Mockito.`when`(currentUserService.currentUserId()).thenReturn(currentUserId)
        Mockito.`when`(opponentService.findById(anyId())).thenReturn(randomOpponent(currentUserId - 1))

        val validationResult = validator.validate(randomRequest())

        assertFalse(validationResult.isSuccess())
        assertEquals(ValidationKeys.CANNOT_BE_LINKED, validationResult.getError())
    }

    @Test
    fun `shouldn't validate when opponent is in invalid state`() {
        val currentUserId = randomId()
        Mockito.`when`(
            notificationService.findNotificationData(anyId(), anyClass(OpponentLinkedNotification::class.java))
        ).thenReturn(OpponentLinkedNotification(randomId(), randomText(), randomId()))

        Mockito.`when`(currentUserService.currentUserId()).thenReturn(currentUserId)
        Mockito.`when`(opponentService.findById(anyId())).thenReturn(randomOpponent(currentUserId, ENABLED))

        val validationResult = validator.validate(randomRequest())

        assertFalse(validationResult.isSuccess())
        assertEquals(ValidationKeys.CANNOT_BE_LINKED, validationResult.getError())
    }

    @Test
    fun `shouldn't validate when no user is linked with opponent`() {
        Mockito.`when`(
            notificationService.findNotificationData(anyId(), anyClass(OpponentLinkedNotification::class.java))
        ).thenReturn(OpponentLinkedNotification(randomId(), randomText(), randomId()))

        Mockito.`when`(opponentService.findById(anyId())).thenReturn(
            OpponentDto(randomId(), randomText())
        )

        val validationResult = validator.validate(randomRequest())

        assertFalse(validationResult.isSuccess())
        assertEquals(ValidationKeys.CANNOT_BE_LINKED, validationResult.getError())
    }

    @Test
    fun `shouldn't validate when selected existing opponent does not exist`() {
        val currentUserId = randomId()
        Mockito.`when`(currentUserService.currentUserId()).thenReturn(currentUserId)
        Mockito.`when`(
            notificationService.findNotificationData(anyId(), anyClass(OpponentLinkedNotification::class.java))
        ).thenReturn(OpponentLinkedNotification(randomId(), randomText(), randomId()))

        Mockito.`when`(opponentService.findById(anyId())).thenReturn(
            randomOpponent(currentUserId)
        )

        Mockito.`when`(linkedOpponentService.canBeLinkedByCurrentUser(anyId())).thenReturn(false)

        val result =
            validator.validate(AcceptOpponentLinkedRequest(randomId(), SelectedOpponent(existingOpponentId = 33L)))

        assertFalse(result.isSuccess())
        assertEquals(ValidationKeys.INVALID_OPPONENT, result.getError())
    }

    @Test
    fun `shouldn't validate when new opponent already exists`() {
        val currentUserId = randomId()
        Mockito.`when`(currentUserService.currentUserId()).thenReturn(currentUserId)
        Mockito.`when`(
            notificationService.findNotificationData(anyId(), anyClass(OpponentLinkedNotification::class.java))
        ).thenReturn(OpponentLinkedNotification(randomId(), randomText(), randomId()))

        Mockito.`when`(opponentService.findById(anyId())).thenReturn(
            randomOpponent(currentUserId)
        )

        Mockito.`when`(opponentService.existsForCurrentUser(anyString())).thenReturn(true)

        val result =
            validator.validate(AcceptOpponentLinkedRequest(randomId(), SelectedOpponent(newOpponentName = randomText())))

        assertFalse(result.isSuccess())
        assertEquals(ValidationKeys.OPPONENT_ALREADY_EXISTS, result.getError())
    }

    private fun randomOpponent(currentUserId: Id, state: LinkedOpponentStatus = WAITING_FOR_CONFIRMATION) = OpponentDto(randomId(),
        randomText(),
        UserLinkedToOpponent(currentUserId, randomText(), state))

    private fun randomRequest() = AcceptOpponentLinkedRequest(randomId(), SelectedOpponent(randomText()))


}
