package com.grudus.planshboard.utils

import com.grudus.planshboard.commons.Id
import com.grudus.planshboard.notifications.model.Notification
import org.hamcrest.Matcher
import org.hamcrest.Matchers
import org.mockito.ArgumentCaptor
import org.mockito.Mockito

@Suppress("RemoveExplicitTypeArguments", "unused", "UNUSED_PARAMETER") // required for type inference and other Mockito related stuff
object TestUtils {
    fun <T> eq(obj: T): T = Mockito.eq<T>(obj)

    /**
     * Returns Mockito.any() as nullable type to avoid java.lang.IllegalStateException when
     * null is returned.
     */
    fun <T> any(): T = Mockito.any<T>()
    fun <T> anyList(): List<T> = Mockito.anyList<T>()
    fun <T> anyClass(aClass: Class<T>): Class<T> = any()
    fun anyId(): Id = Mockito.anyLong()

    fun <T> anyNotification(aClass: Class<T>): Notification<T> = any()

    /**
     * Returns ArgumentCaptor.capture() as nullable type to avoid java.lang.IllegalStateException
     * when null is returned.
     */
    fun <T> capture(argumentCaptor: ArgumentCaptor<T>): T = argumentCaptor.capture()

    fun hasSize(size: Int): Matcher<MutableCollection<out Int>> = Matchers.hasSize<Int>(size)
}
