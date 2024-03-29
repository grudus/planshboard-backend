package com.grudus.planshboard.configuration.filters

import com.grudus.planshboard.auth.TokenAuthService
import com.grudus.planshboard.commons.AuthConstants
import com.grudus.planshboard.commons.AuthConstants.URI_START_WITHOUT_AUTH
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter
import javax.servlet.FilterChain
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

@Component
class StatelessAuthenticationFilter
@Autowired
constructor(private val tokenAuthService: TokenAuthService) : OncePerRequestFilter() {

    override fun doFilterInternal(request: HttpServletRequest, response: HttpServletResponse, filterChain: FilterChain) {

        if (request.requestURI.startsWith(URI_START_WITHOUT_AUTH)) {
            logger.debug("Request ${request.requestURI} doesn't need authentication")
            filterChain.doFilter(request, response)
            return
        }

        val authToken: String? = extractAuthToken(request)

        if (authToken == null) {
            logger.warn("Cannot authenticate request, because auth token is not present")
            filterChain.doFilter(request, response)
            return
        }

        try {
            val authentication = tokenAuthService.parseToken(authToken)
            SecurityContextHolder.getContext().authentication = authentication
        } catch (exception: Exception) {
            logger.warn("Cannot authenticate user. Details: ${exception.message}")
        }

        filterChain.doFilter(request, response)
    }

    private fun extractAuthToken(request: HttpServletRequest): String? =
        request.getHeader(AuthConstants.AUTH_HEADER_NAME)
            ?.removePrefix(AuthConstants.AUTH_TOKEN_PREFIX)
}
