package com.grudus.planshboard.auth

import com.grudus.planshboard.commons.AuthConstants.JWT_USER_ID_HEADER
import com.grudus.planshboard.env.EnvironmentKeys
import com.grudus.planshboard.env.EnvironmentService
import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.util.*
import javax.crypto.SecretKey

@Service
class TokenAuthService
@Autowired
constructor(private val env: EnvironmentService) {
    private val jwtKey: ByteArray by lazy { (env.getText(EnvironmentKeys.JWT_KEY).toByteArray()) }
    private val signKey: SecretKey by lazy { Keys.hmacShaKeyFor(jwtKey) }

    fun generateToken(userAuthentication: UserAuthentication): String {
        return Jwts.builder()
            .setClaims(mapOf(JWT_USER_ID_HEADER to userAuthentication.id))
            .setSubject(userAuthentication.username)
            .setExpiration(expirationDate())
            .signWith(signKey)
            .compact()
    }

    fun parseToken(jwtToken: String): UserAuthentication {
        val claims: Claims = Jwts.parserBuilder()
            .setSigningKey(signKey)
            .build()
            .parseClaimsJws(jwtToken)
            .body

        requireNotNull(claims[JWT_USER_ID_HEADER]) { "Cannot find user id in the jwt token" }
        requireNotNull(claims.subject) { "Cannot find subject in the jwt token" }

        return UserAuthentication(claims[JWT_USER_ID_HEADER].toString().toLong(), claims.subject)
    }

    private fun expirationDate(): Date =
        java.time.LocalDateTime.now()
            .plusSeconds(env.getLong(EnvironmentKeys.JWT_EXPIRE_SECONDS))
            .atZone(java.time.ZoneOffset.systemDefault()).toInstant()
            .let { instant -> Date.from(instant) }
}
