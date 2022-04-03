package com.grudus.planshboard.opponents

import com.grudus.planshboard.commons.exceptions.ResourceNotFoundException
import com.grudus.planshboard.env.EnvironmentService
import com.grudus.planshboard.opponents.linked.LinkedOpponentService
import com.grudus.planshboard.opponents.model.LinkedOpponentStatus
import com.grudus.planshboard.opponents.model.OpponentDto
import com.grudus.planshboard.opponents.model.SaveOpponentRequest
import com.grudus.planshboard.opponents.model.UserLinkedToOpponent
import com.grudus.planshboard.user.CurrentUserService
import com.grudus.planshboard.user.UserService
import com.grudus.planshboard.utils.TestUtils.any
import com.grudus.planshboard.utils.TestUtils.anyId
import com.grudus.planshboard.utils.TestUtils.eq
import com.grudus.planshboard.utils.randomText
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.ArgumentMatchers
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

    @Mock
    private lateinit var opponentStatsDao: OpponentStatsDao

    @Mock
    private lateinit var environmentService: EnvironmentService

    @Mock
    private lateinit var linkedOpponentService: LinkedOpponentService

    private lateinit var opponentService: OpponentService

    @BeforeEach
    fun init() {
        opponentService = OpponentService(opponentDao, linkedOpponentService, opponentStatsDao, userService, currentUserService, environmentService)
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

        verify(opponentDao).createNew(eq(request.opponentName), eq(creatorId))
        verify(linkedOpponentService).linkWithUser(anyId(), ArgumentMatchers.eq(linkedUserId), any())
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

        verify(linkedOpponentService).removeLinkedUser(eq(opponentId))
    }

    @Test
    fun `should update all user links when existing user name is different than already associated user`() {
        val opponentId = nextLong()
        val linkedUserId = nextLong()
        val request = SaveOpponentRequest(randomText(), randomText())

        `when`(opponentDao.findById(eq(opponentId))).thenReturn(OpponentDto(opponentId, randomText(), UserLinkedToOpponent(linkedUserId, randomText(), LinkedOpponentStatus.ENABLED)))
        `when`(userService.findIdByName(eq(request.existingUserName!!))).thenReturn(linkedUserId)

        opponentService.update(opponentId, request)

        verify(linkedOpponentService).removeLinkedUser(eq(opponentId))
        verify(linkedOpponentService).linkWithUser(eq(opponentId), eq(linkedUserId), any())
    }

    @Test
    fun `should not update user links when existing user name doesn't change`() {
        val opponentId = nextLong()
        val linkedUserId = nextLong()
        val existingUserName = randomText()
        val request = SaveOpponentRequest(randomText(), existingUserName)

        `when`(opponentDao.findById(eq(opponentId))).thenReturn(OpponentDto(opponentId, randomText(), UserLinkedToOpponent(linkedUserId, existingUserName, LinkedOpponentStatus.ENABLED)))

        opponentService.update(opponentId, request)

        verify(linkedOpponentService, never()).removeLinkedUser(anyLong())
        verify(linkedOpponentService, never()).linkWithUser(anyLong(), anyLong(), any())
    }

    @Test
    fun `should return distinct frequent opponents`() {
        val opponent1 = OpponentDto(nextLong(), randomText())
        val opponent2 = OpponentDto(nextLong(), randomText())
        val opponent3 = OpponentDto(nextLong(), randomText())

        `when`(opponentStatsDao.findMostFrequentOpponents(anyLong(), anyInt())).thenReturn(
            listOf(opponent1, opponent2)
        )
        `when`(opponentStatsDao.findOpponentsWithMostRecentPlays(anyLong(), anyInt())).thenReturn(
            listOf(opponent2, opponent3)
        )

        val frequentOpponents = opponentService.findFrequentOpponents(nextLong())

        assertEquals(3, frequentOpponents.size)
        listOf(opponent1, opponent2, opponent3).forEach {
            assertTrue(frequentOpponents.contains(it)) { "Cannot find $it in frequent opponent list" }
        }
    }

    @Test
    fun `should sort recently played opponents first`() {
        val opponent1 = OpponentDto(nextLong(), randomText())
        val opponent2 = OpponentDto(nextLong(), randomText())
        val opponent3 = OpponentDto(nextLong(), randomText())

        `when`(opponentStatsDao.findMostFrequentOpponents(anyLong(), anyInt())).thenReturn(
            listOf(opponent1, opponent2)
        )
        `when`(opponentStatsDao.findOpponentsWithMostRecentPlays(anyLong(), anyInt())).thenReturn(
            listOf(opponent2, opponent3)
        )

        val frequentOpponents = opponentService.findFrequentOpponents(nextLong())

        assertEquals(3, frequentOpponents.size)
        assertEquals(opponent2, frequentOpponents[0])
        assertEquals(opponent3, frequentOpponents[1])
        assertEquals(opponent1, frequentOpponents[2])
    }

    @Test
    fun `should return empty list when finding frequent opponents without plays`() {
        `when`(opponentStatsDao.findMostFrequentOpponents(anyLong(), anyInt())).thenReturn(
            listOf()
        )
        `when`(opponentStatsDao.findOpponentsWithMostRecentPlays(anyLong(), anyInt())).thenReturn(
            listOf()
        )

        val frequentOpponents = opponentService.findFrequentOpponents(nextLong())

        assertTrue(frequentOpponents.isEmpty())
    }
}
