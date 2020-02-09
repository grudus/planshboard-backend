package com.grudus.planshboard.auth

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.authentication.BadCredentialsException
import org.springframework.security.core.Authentication
import org.springframework.security.core.AuthenticationException
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class UserLoginService
@Autowired
constructor(private val userAuthDao: UserAuthDao,
            private val passwordEncoder: PasswordEncoder) {

    fun tryToLogin(username: String, password: String): Authentication {
        val user: UserAuthDto = userAuthDao.findByUsername(username)
            ?: throw UsernameNotFoundException("Cannot find user with name [$username]")

        if (!passwordEncoder.matches(password, user.passwordHash)) {
            throw BadCredentialsException("User [$username] enters bad credentials")
        }

        return UserAuthentication(user)
    }
}
