package com.grudus.planshboard.commons.exceptions

import org.jooq.exception.NoDataFoundException

class CannotFetchAfterInsertException :
    NoDataFoundException("Unable to fetch resource after inserting it into the database")
