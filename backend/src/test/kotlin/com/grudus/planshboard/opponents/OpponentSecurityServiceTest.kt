package com.grudus.planshboard.opponents

import com.grudus.planshboard.commons.exceptions.UserHasNoAccessToResourceException
import com.grudus.planshboard.user.CurrentUserService
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertDoesNotThrow
import org.junit.jupiter.api.assertThrows
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.ArgumentMatchers.eq
import org.mockito.Mock
import org.mockito.Mockito.`when`
import org.mockito.Mockito.anyLong
import org.mockito.junit.jupiter.MockitoExtension
import kotlin.random.Random.Default.nextLong

@ExtendWith(MockitoExtension::class)
class OpponentSecurityServiceTest {
    @Mock
    private lateinit var opponentDao: OpponentDao

    @Mock
    private lateinit var currentUserService: CurrentUserService

    private lateinit var securityService: OpponentSecurityService

    @BeforeEach
    fun init() {
        securityService = OpponentSecurityService(opponentDao, currentUserService)
    }

    @Test
    fun `should do nothing when user has access`() {
        val opponentId = nextLong()
        `when`(currentUserService.currentUserId()).thenReturn(nextLong())
        `when`(opponentDao.isCreatedByUser(eq(opponentId), anyLong())).thenReturn(true)

        assertDoesNotThrow {
            securityService.checkAccess(opponentId)
        }
    }

    @Test
    fun `should throw an exception when user has no access`() {
        val opponentId = nextLong()
        `when`(currentUserService.currentUserId()).thenReturn(nextLong())
        `when`(opponentDao.isCreatedByUser(eq(opponentId), anyLong())).thenReturn(false)

        assertThrows<UserHasNoAccessToResourceException> {
            securityService.checkAccess(opponentId)
        }
    }
}
