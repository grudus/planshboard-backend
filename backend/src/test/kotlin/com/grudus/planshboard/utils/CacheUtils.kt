package com.grudus.planshboard.utils

import org.springframework.cache.Cache
import org.springframework.cache.caffeine.CaffeineCache

object CacheUtils {

    fun retrieveFromCacheCount(cache: Cache): Long {
        return (cache as CaffeineCache).nativeCache.stats().hitCount()
    }

    fun loadFromInitialSourceCount(cache: Cache): Long {
        return (cache as CaffeineCache).nativeCache.stats().missCount()
    }
}
