package com.grudus.planshboard.opponents

import com.grudus.planshboard.AuthenticatedControllerTest
import com.grudus.planshboard.utils.TestUtils.hasSize
import org.junit.jupiter.api.Test
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

class OpponentControllerTest: AuthenticatedControllerTest() {
    private val baseUrl = "/api/opponents"

    @Test
    fun shouldGetInitialOpponent() {
        getRequest(baseUrl)
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.[*]", hasSize(1)))
            .andExpect(jsonPath("$.[0].id").isNotEmpty)
            .andExpect(jsonPath("$.[0].name").isNotEmpty)
            .andExpect(jsonPath("$.[0].existingUserName").value(authentication.username))
    }

}
