package com.grudus.planshboard.auth

import com.grudus.planshboard.opponents.OpponentService
import com.grudus.planshboard.utils.MockCurrentTimeProvider
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
import org.springframework.security.core.Authentication
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.security.crypto.password.PasswordEncoder
import kotlin.random.Random.Default.nextLong

@ExtendWith(MockitoExtension::class)
class UserLoginServiceTest {
    @Mock
    private lateinit var userAuthDao: UserAuthDao
    @Mock
    private lateinit var passwordEncoder: PasswordEncoder
    @Mock
    private lateinit var opponentService: OpponentService

    private lateinit var userService: UserAuthenticationService

    @BeforeEach
    fun init() {
        userService = UserAuthenticationService(userAuthDao, passwordEncoder, opponentService, MockCurrentTimeProvider())
    }

    @Test
    fun `should get authentication correctly`() {
        val userAuthDto = UserAuthDto(nextLong(), randomText(), randomText())
        Mockito.`when`(userAuthDao.findByUsername(anyString())).thenReturn(userAuthDto)
        Mockito.`when`(passwordEncoder.matches(anyString(), anyString())).thenReturn(true)

        val authentication: Authentication = userService.tryToLogin(userAuthDto.username, userAuthDto.passwordHash)

        assertEquals(authentication.name, userAuthDto.username)
    }

    @Test
    fun `should throw exception when user not found`() {
        Mockito.`when`(userAuthDao.findByUsername(anyString())).thenReturn(null)

        assertThrows<UsernameNotFoundException> {
            userService.tryToLogin(randomText(), randomText())
        }
    }

    @Test
    fun `should throw exception when invalid password`() {
        val userAuthDto = UserAuthDto(nextLong(), randomText(), randomText())
        Mockito.`when`(userAuthDao.findByUsername(anyString())).thenReturn(userAuthDto)
        Mockito.`when`(passwordEncoder.matches(anyString(), anyString())).thenReturn(false)

        assertThrows<BadCredentialsException> {
            userService.tryToLogin(randomText(), randomText())
        }
    }

}
