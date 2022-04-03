package com.grudus.planshboard.commons.security

import com.grudus.planshboard.commons.Id
import com.grudus.planshboard.commons.exceptions.UserHasNoAccessToResourceException
import com.grudus.planshboard.user.CurrentUserService
import com.grudus.planshboard.utils.randomId
import org.junit.jupiter.api.Assertions.assertFalse
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertDoesNotThrow
import org.junit.jupiter.api.assertThrows
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mock
import org.mockito.Mockito
import org.mockito.junit.jupiter.MockitoExtension


@ExtendWith(MockitoExtension::class)
class SecurityGuardTest {
    @Mock
    private lateinit var currentUserService: CurrentUserService

    @BeforeEach
    fun init() {
        Mockito.`when`(currentUserService.currentUserId()).thenReturn(randomId())
    }

    @Test
    fun `should return access forbidden when user has no access`() {
        val accessToResourceChecker = object : AccessToResourceChecker {
            override fun canBeAccessedByUser(userId: Id, entityIds: List<Id>): Boolean {
                return false
            }
        }
        val securityGuard = object : SecurityGuard(currentUserService, accessToResourceChecker) {}

        val accessResponse = securityGuard.checkAccess(randomId())

        assertFalse(accessResponse.hasAccess())
    }

    @Test
    fun `should be able to throw on error when access forbidden`() {
        val accessToResourceChecker = object : AccessToResourceChecker {
            override fun canBeAccessedByUser(userId: Id, entityIds: List<Id>): Boolean {
                return false
            }
        }
        val securityGuard = object : SecurityGuard(currentUserService, accessToResourceChecker) {}

        val accessResponse = securityGuard.checkAccess(randomId())

        assertThrows<UserHasNoAccessToResourceException> {
            accessResponse.throwWhenAccessForbidden()
        }
    }

    @Test
    fun `should do nothing when throwing on access forbidden when access is allowed`() {
        val accessToResourceChecker = object : AccessToResourceChecker {
            override fun canBeAccessedByUser(userId: Id, entityIds: List<Id>): Boolean {
                return true
            }
        }
        val securityGuard = object : SecurityGuard(currentUserService, accessToResourceChecker) {}

        val accessResponse = securityGuard.checkAccess(randomId())

        assertTrue(accessResponse.hasAccess())
        assertDoesNotThrow {
            accessResponse.throwWhenAccessForbidden()
        }
    }
}
