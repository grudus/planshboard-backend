package com.grudus.planshboard.opponents

import com.grudus.planshboard.commons.exceptions.ResourceNotFoundException
import com.grudus.planshboard.opponents.model.LinkedOpponentStatus
import com.grudus.planshboard.opponents.model.OpponentDto
import com.grudus.planshboard.opponents.model.SaveOpponentRequest
import com.grudus.planshboard.opponents.model.UserLinkedToOpponent
import com.grudus.planshboard.user.CurrentUserService
import com.grudus.planshboard.user.UserService
import com.grudus.planshboard.utils.TestUtils.any
import com.grudus.planshboard.utils.TestUtils.eq
import com.grudus.planshboard.utils.randomText
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.ArgumentMatchers.anyLong
import org.mockito.Mock
import org.mockito.Mockito.*
import org.mockito.junit.jupiter.MockitoExtension
import kotlin.random.Random.Default.nextLong

@ExtendWith(MockitoExtension::class)
class OpponentServiceTest {
    @Mock
    private lateinit var opponentDao: OpponentDao

    @Mock
    private lateinit var userService: UserService

    @Mock
    private lateinit var currentUserService: CurrentUserService

    private lateinit var opponentService: OpponentService

    @BeforeEach
    fun init() {
        opponentService = OpponentService(opponentDao, userService, currentUserService)
    }

    @Test
    fun `should create new opponent without associated user`() {
        val request = SaveOpponentRequest(randomText())

        opponentService.create(request, nextLong())

        verify(opponentDao).createNew(eq(request.opponentName), anyLong())
    }

    @Test
    fun `should create new opponent with user`() {
        val creatorId = nextLong()
        val linkedUserId = nextLong()
        val request = SaveOpponentRequest(randomText(), randomText())
        `when`(userService.findIdByName(eq(request.existingUserName!!))).thenReturn(linkedUserId)

        opponentService.create(request, creatorId)

        verify(opponentDao).createAndLinkToUser(eq(request.opponentName), eq(creatorId), eq(linkedUserId), any())
    }

    @Test
    fun `should not create opponent when user doesn't exist`() {
        val creatorId = nextLong()
        val request = SaveOpponentRequest(randomText(), randomText())
        `when`(userService.findIdByName(eq(request.existingUserName!!))).thenReturn(null)

        assertThrows<ResourceNotFoundException> {
            opponentService.create(request, creatorId)
        }
    }

    @Test
    fun `should update opponent name`() {
        val opponentId = nextLong()
        val request = SaveOpponentRequest(randomText())

        opponentService.update(opponentId, request)

        verify(opponentDao).updateName(eq(opponentId), eq(request.opponentName))
    }

    @Test
    fun `should remove all user links when not specify existing user name`() {
        val opponentId = nextLong()
        val request = SaveOpponentRequest(randomText())

        opponentService.update(opponentId, request)

        verify(opponentDao).removeLinkedUser(eq(opponentId))
    }

    @Test
    fun `should update all user links when existing user name is different than already associated user`() {
        val opponentId = nextLong()
        val linkedUserId = nextLong()
        val request = SaveOpponentRequest(randomText(), randomText())

        `when`(opponentDao.findById(eq(opponentId))).thenReturn(OpponentDto(opponentId, randomText(), UserLinkedToOpponent(linkedUserId, randomText(), LinkedOpponentStatus.ENABLED)))
        `when`(userService.findIdByName(eq(request.existingUserName!!))).thenReturn(linkedUserId)

        opponentService.update(opponentId, request)

        verify(opponentDao).removeLinkedUser(eq(opponentId))
        verify(opponentDao).linkToUser(eq(opponentId), eq(linkedUserId), any())
    }

    @Test
    fun `should not update user links when existing user name doesn't change`() {
        val opponentId = nextLong()
        val linkedUserId = nextLong()
        val existingUserName = randomText()
        val request = SaveOpponentRequest(randomText(), existingUserName)

        `when`(opponentDao.findById(eq(opponentId))).thenReturn(OpponentDto(opponentId, randomText(), UserLinkedToOpponent(linkedUserId, existingUserName, LinkedOpponentStatus.ENABLED)))

        opponentService.update(opponentId, request)

        verify(opponentDao, never()).removeLinkedUser(anyLong())
        verify(opponentDao, never()).linkToUser(anyLong(), anyLong(), any())
    }
}
