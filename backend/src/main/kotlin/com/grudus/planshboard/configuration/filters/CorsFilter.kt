package com.grudus.planshboard.configuration.filters

import com.grudus.planshboard.commons.AuthConstants.AUTH_HEADER_NAME
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component
import org.springframework.web.bind.annotation.RequestMethod
import org.springframework.web.filter.GenericFilterBean
import javax.servlet.FilterChain
import javax.servlet.ServletRequest
import javax.servlet.ServletResponse
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

@Component
class CorsFilter
@Autowired
constructor(private val allowedOrigins: List<String>): GenericFilterBean() {


    override fun doFilter(req: ServletRequest, res: ServletResponse, chain: FilterChain) {
        val response = res as HttpServletResponse
        val request = req as HttpServletRequest

        val origin = request.getHeader("origin")

        if (allowedOrigins.contains(origin)) {
            response.setHeader("Access-Control-Allow-Origin", origin)
            response.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS")
            response.setHeader("Access-Control-Allow-Headers", "withCredentials, content-type, $AUTH_HEADER_NAME")
            response.setHeader("Access-Control-Allow-Credentials", "true")
            response.setHeader("Access-Control-Expose-Headers", AUTH_HEADER_NAME)
            response.setHeader("withCredentials", "true")
        }

        if (request.method != RequestMethod.OPTIONS.name) {
            chain.doFilter(request, response)
            return
        }
    }
}
