package com.grudus.planshboard.user

import com.grudus.planshboard.AuthenticatedControllerTest
import org.junit.jupiter.api.Test
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status


class UserControllerTest: AuthenticatedControllerTest() {
    val baseUrl = "/api/users"

    @Test
    fun `should get current user`() {
        getRequest("$baseUrl/me")
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.id").value(authentication.id))
            .andExpect(jsonPath("$.username").value(authentication.username))
    }

}
