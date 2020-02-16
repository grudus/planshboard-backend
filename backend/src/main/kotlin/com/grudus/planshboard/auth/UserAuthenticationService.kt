package com.grudus.planshboard.auth

import com.grudus.planshboard.auth.registration.RegisterUserRequest
import com.grudus.planshboard.commons.CurrentTimeProvider
import com.grudus.planshboard.commons.Id
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.authentication.BadCredentialsException
import org.springframework.security.core.Authentication
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class UserAuthenticationService
@Autowired
constructor(private val userAuthDao: UserAuthDao,
            private val passwordEncoder: PasswordEncoder,
            private val currentTimeProvider: CurrentTimeProvider) {

    fun tryToLogin(username: String, password: String): Authentication {
        val user: UserAuthDto = userAuthDao.findByUsername(username)
            ?: throw UsernameNotFoundException("Cannot find user with name [$username]")

        if (!passwordEncoder.matches(password, user.passwordHash)) {
            throw BadCredentialsException("User [$username] enters bad credentials")
        }

        return UserAuthentication(user)
    }

    fun register(request: RegisterUserRequest): Id {
        val hashedPassword = passwordEncoder.encode(request.password)
        return userAuthDao.registerUser(request.username, hashedPassword, currentTimeProvider.now())
    }

    fun exists(username: String): Boolean =
        userAuthDao.exists(username)
}
