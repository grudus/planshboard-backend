package com.grudus.planshboard.utils

import com.github.benmanes.caffeine.cache.stats.CacheStats
import org.springframework.cache.Cache
import org.springframework.cache.caffeine.CaffeineCache

object CacheUtils {
    // There is no way to clear internal CacheStats, so in case to run multiple tests
    // which call hitCount or missCount we need to manually subtract previous invocations -
    // each Test class has to call `clearStats` in `@AfterEach` (or `@BeforeEach`)
    private val zeroCache = mutableMapOf<Cache, CacheStats>()

    fun retrieveFromCacheCount(cache: Cache): Long {
        val zeroStats = zeroCache.getOrDefault(cache, CacheStats.empty())
        return (cache as CaffeineCache).nativeCache.stats().minus(zeroStats).hitCount()
    }

    fun loadFromInitialSourceCount(cache: Cache): Long {
        val zeroStats = zeroCache.getOrDefault(cache, CacheStats.empty())
        return (cache as CaffeineCache).nativeCache.stats().minus(zeroStats).missCount()
    }

    fun clearStats(cache: Cache) {
        val nativeCache = (cache as CaffeineCache).nativeCache
        nativeCache.cleanUp()
        zeroCache[cache] = nativeCache.stats()
    }
}
