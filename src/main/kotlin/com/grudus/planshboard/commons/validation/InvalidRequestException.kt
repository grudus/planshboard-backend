package com.grudus.planshboard.commons.validation

import com.grudus.planshboard.commons.ErrorKey

class InvalidRequestException(val error: ErrorKey): RuntimeException("Invalid request: (${error})")
