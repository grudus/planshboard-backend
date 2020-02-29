package com.grudus.planshboard.user

import com.grudus.planshboard.auth.UserAuthentication
import com.grudus.planshboard.commons.Id
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException
import org.springframework.security.core.Authentication
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service

@Service
class CurrentUserService {

    fun currentUserId(): Id =
        getAuthentication().let { auth ->
            when (auth) {
                is UserAuthentication -> auth.id
                else -> throw AuthenticationCredentialsNotFoundException("Cannot obtain current user id")
            }
        }

    private fun getAuthentication(): Authentication =
        SecurityContextHolder.getContext().authentication


}
