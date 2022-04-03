package com.grudus.planshboard.commons.utils


fun List<Enum<*>>.toEnumNames(): List<String> = this.map { it.name }

