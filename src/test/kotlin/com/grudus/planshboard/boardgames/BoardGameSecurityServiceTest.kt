package com.grudus.planshboard.boardgames

import com.grudus.planshboard.commons.exceptions.UserHasNoAccessToResourceException
import com.grudus.planshboard.user.CurrentUserService
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertDoesNotThrow
import org.junit.jupiter.api.assertThrows
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.ArgumentMatchers.anyLong
import org.mockito.ArgumentMatchers.eq
import org.mockito.Mock
import org.mockito.Mockito.`when`
import org.mockito.junit.jupiter.MockitoExtension
import kotlin.random.Random.Default.nextLong

@ExtendWith(MockitoExtension::class)
class BoardGameSecurityServiceTest {
    @Mock
    private lateinit var boardGameDao: BoardGameDao
    @Mock
    private lateinit var currentUserService: CurrentUserService

    private lateinit var boardGameSecurityService: BoardGameSecurityService

    @BeforeEach
    fun init() {
        boardGameSecurityService = BoardGameSecurityService(boardGameDao, currentUserService)
    }

    @Test
    fun `should do nothing when checking user with access`() {
        val boardGameId = nextLong()
        `when`(currentUserService.currentUserId()).thenReturn(nextLong())
        `when`(boardGameDao.isCreatedByUser(eq(boardGameId), anyLong())).thenReturn(true)

        assertDoesNotThrow {
            boardGameSecurityService.checkAccess(boardGameId)
        }
    }

    @Test
    fun `should throw an exception when user has no access`() {
        val boardGameId = nextLong()
        `when`(currentUserService.currentUserId()).thenReturn(nextLong())
        `when`(boardGameDao.isCreatedByUser(eq(boardGameId), anyLong())).thenReturn(false)

        assertThrows<UserHasNoAccessToResourceException> {
            boardGameSecurityService.checkAccess(boardGameId)
        }
    }
}
