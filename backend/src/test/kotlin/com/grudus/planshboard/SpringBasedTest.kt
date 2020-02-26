package com.grudus.planshboard

import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.annotation.Rollback
import org.springframework.test.context.ContextConfiguration
import org.springframework.test.context.web.WebAppConfiguration
import org.springframework.transaction.annotation.Transactional

@SpringBootTest
@ContextConfiguration(classes = [TestContext::class])
@WebAppConfiguration
@Transactional
@Rollback
abstract class SpringBasedTest
