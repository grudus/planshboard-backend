package com.grudus.planshboard

import com.fasterxml.jackson.databind.ObjectMapper
import com.grudus.planshboard.configuration.filters.StatelessAuthenticationFilter
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.BeforeEach
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.MediaType
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.ResultActions
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultHandlers
import org.springframework.test.web.servlet.setup.DefaultMockMvcBuilder
import org.springframework.test.web.servlet.setup.MockMvcBuilders
import org.springframework.web.context.WebApplicationContext

abstract class AbstractControllerTest : SpringBasedTest() {

    @Autowired
    private lateinit var wac: WebApplicationContext

    @Autowired
    private lateinit var statelessAuthenticationFilter: StatelessAuthenticationFilter

    @Autowired
    private lateinit var objectMapper: ObjectMapper

    protected lateinit var mockMvc: MockMvc

    @BeforeEach
    fun setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(wac)
            .addFilters<DefaultMockMvcBuilder>(statelessAuthenticationFilter)
            .build()
    }

    @AfterEach
    fun cleanUp() {
        SecurityContextHolder.clearContext()
    }

    protected fun <T> postRequest(url: String, requestBody: T): ResultActions =
        mockMvc.perform(MockMvcRequestBuilders.post(url)
            .contentType(MediaType.APPLICATION_JSON)
            .content(toJson(requestBody)))

    protected fun getRequest(url: String, vararg uriArgs: String): ResultActions =
        mockMvc.perform(MockMvcRequestBuilders.get(url, uriArgs))

    protected fun <T> toJson(o: T): ByteArray =
        objectMapper.writeValueAsBytes(o)

    protected fun <T> ResultActions.getResponse(aClass: Class<T>): T =
        objectMapper.readValue(this.andReturn().response.contentAsString, aClass)

    protected fun ResultActions.debug(): ResultActions =
        this.andDo(MockMvcResultHandlers.print())


}

