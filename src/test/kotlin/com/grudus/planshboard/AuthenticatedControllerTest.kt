package com.grudus.planshboard

import com.grudus.planshboard.auth.TokenAuthService
import com.grudus.planshboard.auth.UserAuthentication
import com.grudus.planshboard.auth.UserAuthenticationService
import com.grudus.planshboard.auth.registration.RegisterUserRequest
import com.grudus.planshboard.commons.AuthConstants.AUTH_HEADER_NAME
import com.grudus.planshboard.commons.Id
import com.grudus.planshboard.utils.randomText
import org.junit.jupiter.api.BeforeEach
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.MediaType
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.test.web.servlet.ResultActions
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import kotlin.text.Charsets.UTF_8

abstract class AuthenticatedControllerTest : AbstractControllerTest() {

    @Autowired
    private lateinit var authService: UserAuthenticationService

    @Autowired
    private lateinit var tokenService: TokenAuthService

    protected lateinit var authentication: UserAuthentication
    private lateinit var token: String

    @BeforeEach
    fun createInitialAuthentication() {
        setupAuthContextForAnotherUser()
    }

    protected fun setupAuthContextForAnotherUser(authentication: UserAuthentication = createNewAuthentication()) {
        setupTokenAuthentication(authentication)
    }

    protected fun <T> runWithAnotherUserContext(func: (UserAuthentication) -> T): T =
        runWithAnotherUserContext(createNewAuthentication(), func)

    protected fun <T> runWithAnotherUserContext(user: UserAuthentication, func: (UserAuthentication) -> T): T {
        val initialAuth = authentication
        setupAuthContextForAnotherUser(user)
        val result = func(authentication)
        setupAuthContextForAnotherUser(initialAuth)
        return result
    }

    private fun setupTokenAuthentication(authentication: UserAuthentication) {
        this.authentication = authentication
        token = tokenService.generateToken(authentication)
        setupContext()
    }

    private fun createNewAuthentication(): UserAuthentication {
        val username = randomText()
        val password = randomText()
        addUser(username, password)
        return authService.tryToLogin(username, password) as UserAuthentication
    }

    override fun <T> postRequest(url: String, requestBody: T): ResultActions =
        performRequestWithAuth(
            MockMvcRequestBuilders.post(url)
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .characterEncoding(UTF_8.name())
                .content(toJson(requestBody))
        )

    fun getRequest(url: String): ResultActions =
        performRequestWithAuth(MockMvcRequestBuilders.get(url))

    fun deleteRequest(url: String): ResultActions =
        performRequestWithAuth(MockMvcRequestBuilders.delete(url))

    fun <T> putRequest(url: String, requestBody: T): ResultActions =
        performRequestWithAuth(
            MockMvcRequestBuilders.put(url)
                .contentType(MediaType.APPLICATION_JSON)
                .content(toJson(requestBody))
        )

    private fun setupContext() {
        val context = SecurityContextHolder.createEmptyContext()
        SecurityContextHolder.setContext(context)
        context.authentication = authentication
    }

    protected fun addUser(username: String = randomText(), password: String = randomText()): Id =
        authService.register(RegisterUserRequest(username, password, password))


    private fun performRequestWithAuth(requestBuilders: MockHttpServletRequestBuilder): ResultActions {
        return mockMvc.perform(requestBuilders.header(AUTH_HEADER_NAME, token).principal(authentication))
    }
}
