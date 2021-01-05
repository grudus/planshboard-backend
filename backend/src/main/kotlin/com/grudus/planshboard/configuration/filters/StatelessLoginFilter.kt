package com.grudus.planshboard.configuration.filters

import com.grudus.planshboard.auth.TokenAuthService
import com.grudus.planshboard.auth.UserAuthentication
import com.grudus.planshboard.auth.UserAuthenticationService
import com.grudus.planshboard.commons.AuthConstants
import com.grudus.planshboard.commons.AuthConstants.AUTH_HEADER_NAME
import com.grudus.planshboard.commons.AuthConstants.AUTH_TOKEN_PREFIX
import com.grudus.planshboard.commons.AuthConstants.LOGIN_PATH
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.core.Authentication
import org.springframework.security.core.AuthenticationException
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter
import org.springframework.stereotype.Component
import javax.servlet.FilterChain
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

@Component
class StatelessLoginFilter
@Autowired
constructor(private val userAuthenticationService: UserAuthenticationService,
            private val tokenAuthService: TokenAuthService) : AbstractAuthenticationProcessingFilter(LOGIN_PATH) {

    private val log = LoggerFactory.getLogger(javaClass.simpleName)

    init { // Because AbstractAuthenticationProcessingFilter requires authManager for no reason
        super.setAuthenticationManager { a -> a }
    }

    override fun attemptAuthentication(request: HttpServletRequest, response: HttpServletResponse): Authentication {
        val username = request.getParameter(AuthConstants.LOGIN_USERNAME_PARAM)
        val password = request.getParameter(AuthConstants.LOGIN_PASSWORD_PARAM)

        return userAuthenticationService.tryToLogin(username, password)
    }

    override fun successfulAuthentication(request: HttpServletRequest, response: HttpServletResponse, chain: FilterChain, authResult: Authentication) {
        val auth = authResult as UserAuthentication
        val token: String = tokenAuthService.generateToken(auth)

        log.info("User[${auth.id}] successfully authenticated")
        SecurityContextHolder.getContext().authentication = auth
        response.setHeader(AUTH_HEADER_NAME, "$AUTH_TOKEN_PREFIX$token")
    }

    override fun unsuccessfulAuthentication(request: HttpServletRequest, response: HttpServletResponse, failed: AuthenticationException) {
        log.warn("Cannot authenticate user. Details: ${failed.localizedMessage}")
        response.sendError(HttpServletResponse.SC_UNAUTHORIZED, failed.message)
    }
}
