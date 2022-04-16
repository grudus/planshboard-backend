package com.grudus.planshboard.commons.utils

inline fun <reified T : Enum<T>> convert(enum: Enum<*>?, aClass: Class<T>): T? =
    if (enum == null) null else aClass.enumConstants.first { it.name === enum.name }

