package com.grudus.planshboard

import org.jooq.DSLContext
import org.springframework.beans.factory.annotation.Autowired

abstract class AbstractDatabaseTest : SpringBasedTest() {

    @Autowired
    protected lateinit var dsl: DSLContext
}
