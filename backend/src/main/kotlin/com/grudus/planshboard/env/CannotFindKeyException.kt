package com.grudus.planshboard.env

import java.lang.RuntimeException

class CannotFindKeyException(key: String) : RuntimeException("Cannot find variable associated with key [$key]")
