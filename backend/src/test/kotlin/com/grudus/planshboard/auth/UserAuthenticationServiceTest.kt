package com.grudus.planshboard.auth

import com.grudus.planshboard.auth.registration.RegisterUserRequest
import com.grudus.planshboard.commons.SystemCurrentTimeProvider
import com.grudus.planshboard.opponents.OpponentService
import com.grudus.planshboard.utils.TestUtils.any
import com.grudus.planshboard.utils.TestUtils.eq
import com.grudus.planshboard.utils.randomText
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.ArgumentMatchers.anyString
import org.mockito.Mock
import org.mockito.Mockito
import org.mockito.junit.jupiter.MockitoExtension
import org.springframework.security.authentication.BadCredentialsException
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.security.crypto.password.PasswordEncoder
import kotlin.random.Random.Default.nextLong

@ExtendWith(MockitoExtension::class)
class UserAuthenticationServiceTest {
    @Mock
    private lateinit var userAuthDao: UserAuthDao
    @Mock
    private lateinit var passwordEncoder: PasswordEncoder
    @Mock
    private lateinit var opponentService: OpponentService

    private lateinit var userAuthenticationService: UserAuthenticationService

    @BeforeEach
    fun init() {
        userAuthenticationService = UserAuthenticationService(userAuthDao, passwordEncoder, opponentService, SystemCurrentTimeProvider())
    }

    @Test
    fun `should hash password before save`() {
        val password = randomText()
        val hashedPassword = randomText()
        val id = nextLong()
        Mockito.`when`(passwordEncoder.encode(password)).thenReturn(hashedPassword)
        Mockito.`when`(userAuthDao.registerUser(anyString(), eq(hashedPassword), any()))
            .thenReturn(id)

        val registerId = userAuthenticationService.register(RegisterUserRequest(randomText(), password, password))

        assertEquals(id, registerId)
    }

    @Test
    fun `should return authentication when valid user tries to log in`() {
        val username = randomText()
        val password = randomText()
        val hashedPassword = randomText()

        Mockito.`when`(userAuthDao.findByUsername(username)).thenReturn(UserAuthDto(nextLong(), username, hashedPassword))
        Mockito.`when`(passwordEncoder.matches(password, hashedPassword)).thenReturn(true)

        val authentication = userAuthenticationService.tryToLogin(username, password)

        assertEquals(username, authentication.name)
    }

    @Test
    fun `should not be able to log in when user does not exists`() {
        val username = randomText()
        val password = randomText()

        Mockito.`when`(userAuthDao.findByUsername(username)).thenReturn(null)

        assertThrows<UsernameNotFoundException> {
            userAuthenticationService.tryToLogin(username, password)
        }
    }

    @Test
    fun `should not be able to log in when passwords don't match`() {
        val username = randomText()
        val password = randomText()
        val hashedPassword = randomText()

        Mockito.`when`(userAuthDao.findByUsername(username)).thenReturn(UserAuthDto(nextLong(), username, hashedPassword))
        Mockito.`when`(passwordEncoder.matches(any(), any())).thenReturn(false)

        assertThrows<BadCredentialsException> {
            userAuthenticationService.tryToLogin(username, password)
        }
    }
}
