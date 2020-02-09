package com.grudus.planshboard.auth

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
import utils.randomText
import kotlin.random.Random.Default.nextLong
import kotlin.test.assertEquals

@ExtendWith(MockitoExtension::class)
class UserLoginServiceTest {
    @Mock
    private lateinit var userAuthDao: UserAuthDao
    @Mock
    private lateinit var passwordEncoder: PasswordEncoder

    private lateinit var userService: UserLoginService

    @BeforeEach
    fun init() {
        userService = UserLoginService(userAuthDao, passwordEncoder)
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
