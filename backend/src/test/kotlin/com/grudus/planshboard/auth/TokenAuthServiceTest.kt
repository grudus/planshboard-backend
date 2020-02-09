package com.grudus.planshboard.auth

import com.grudus.planshboard.env.EnvironmentKeys
import com.grudus.planshboard.env.EnvironmentService
import io.jsonwebtoken.ExpiredJwtException
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertDoesNotThrow
import org.junit.jupiter.api.assertThrows
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mock
import org.mockito.Mockito
import org.mockito.junit.jupiter.MockitoExtension
import utils.MockCurrentTimeProvider
import java.time.LocalDateTime
import kotlin.test.assertEquals

@ExtendWith(MockitoExtension::class)
class TokenAuthServiceTest {
    // for userId 1 and username 'grudus'
    private val TEST_JWT_KEY = "Secret JWT key. PlanshboardApp is secure enough!"
    private val TEST_JWT_USERNAME = "grudus"
    private val TEST_JWT_USER_ID = 1L
    private val MAX_EPOCH_DAY = 365241780471L

    @Mock
    private lateinit var env: EnvironmentService
    private val timeProvider = MockCurrentTimeProvider()

    private lateinit var tokenAuthService: TokenAuthService

    @BeforeEach
    fun init() {
        Mockito.`when`(env.getText(EnvironmentKeys.JWT_KEY)).thenReturn(TEST_JWT_KEY)
        Mockito.`when`(env.getLong(EnvironmentKeys.JWT_EXPIRE_SECONDS)).thenReturn(MAX_EPOCH_DAY)

        tokenAuthService = TokenAuthService(env, timeProvider)
    }

    @Test
    fun `should generate JWT token correctly`() {
        assertDoesNotThrow {
            tokenAuthService.generateToken(UserAuthentication(TEST_JWT_USER_ID, TEST_JWT_USERNAME))
        }
    }

    @Test
    fun `should parse JWT token correctly`() {
        val token = tokenAuthService.generateToken(UserAuthentication(TEST_JWT_USER_ID, TEST_JWT_USERNAME))
        val authentication = tokenAuthService.parseToken(token)

        assertEquals(TEST_JWT_USER_ID, authentication.id)
        assertEquals(TEST_JWT_USERNAME, authentication.username)
    }

    @Test
    fun `should not parse JWT token when date expired`() {
        Mockito.`when`(env.getLong(EnvironmentKeys.JWT_EXPIRE_SECONDS)).thenReturn(1L)
        timeProvider.setDate(LocalDateTime.now().minusDays(1))

        val token = tokenAuthService.generateToken(UserAuthentication(TEST_JWT_USER_ID, TEST_JWT_USERNAME))
        assertThrows<ExpiredJwtException> { tokenAuthService.parseToken(token) }
    }
}
