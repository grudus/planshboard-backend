package com.grudus.planshboard.utils

import com.grudus.planshboard.commons.Id
import java.util.UUID.randomUUID
import kotlin.math.abs
import kotlin.random.Random.Default.nextLong

fun randomText(): String = randomUUID().toString()
fun randomId(): Id = abs(nextLong())
