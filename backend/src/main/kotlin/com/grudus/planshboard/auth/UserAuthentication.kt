package com.grudus.planshboard.auth

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken

class UserAuthentication(val id: Long, val username: String) : UsernamePasswordAuthenticationToken(username, null, emptyList()) {
    constructor(userAuthDto: UserAuthDto) : this(userAuthDto.id, userAuthDto.username)
}
