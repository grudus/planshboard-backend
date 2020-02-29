package com.grudus.planshboard.utils

import org.hamcrest.Matcher
import org.hamcrest.Matchers
import org.mockito.ArgumentCaptor
import org.mockito.Mockito

object TestUtils {
    fun <T> eq(obj: T): T = Mockito.eq<T>(obj)

    /**
     * Returns Mockito.any() as nullable type to avoid java.lang.IllegalStateException when
     * null is returned.
     */
    fun <T> any(): T = Mockito.any<T>()

    /**
     * Returns ArgumentCaptor.capture() as nullable type to avoid java.lang.IllegalStateException
     * when null is returned.
     */
    fun <T> capture(argumentCaptor: ArgumentCaptor<T>): T = argumentCaptor.capture()

    fun hasSize(size: Int): Matcher<MutableCollection<out Int>> = Matchers.hasSize<Int>(size)
}
