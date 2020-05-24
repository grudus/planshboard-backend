package com.grudus.planshboard.plays.tags

import com.grudus.planshboard.commons.Id
import com.grudus.planshboard.user.CurrentUserService
import com.grudus.planshboard.utils.TestUtils.any
import com.grudus.planshboard.utils.TestUtils.eq
import com.grudus.planshboard.utils.randomText
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.ArgumentCaptor
import org.mockito.ArgumentMatchers.anyList
import org.mockito.ArgumentMatchers.anyLong
import org.mockito.Mock
import org.mockito.Mockito
import org.mockito.junit.jupiter.MockitoExtension
import kotlin.random.Random.Default.nextLong

@ExtendWith(MockitoExtension::class)
class TagServiceTest {
    @Mock
    private lateinit var tagDao: TagDao

    @Mock
    private lateinit var currentUserService: CurrentUserService

    private lateinit var tagService: TagService

    @BeforeEach
    fun init() {
        tagService = TagService(tagDao, currentUserService)
        Mockito.`when`(currentUserService.currentUserId()).thenReturn(nextLong())
    }

    @Test
    fun `should save tags and link to play when all new tags`() {
        val tags = listOf(randomText(), randomText(), randomText())
        val savedIds = listOf(nextLong(), nextLong(), nextLong())

        Mockito.`when`(tagDao.filterExistingTags(eq(tags), anyLong())).thenReturn(emptyList())
        Mockito.`when`(tagDao.saveTags(eq(tags), anyLong())).thenReturn(savedIds)

        tagService.addTagsToPlay(tags, nextLong())

        Mockito.verify(tagDao).saveTags(eq(tags), anyLong())
        Mockito.verify(tagDao).linkTagsToPlay(eq(savedIds), anyLong())
    }

    @Test
    fun `should save tags and link to play when some tags are new and some not`() {
        val tags = listOf(randomText(), randomText(), randomText())
        val savedIds = listOf(nextLong(), nextLong())
        val existingTags = listOf(Tag(nextLong(), tags[0], nextLong()))

        Mockito.`when`(tagDao.filterExistingTags(eq(tags), anyLong())).thenReturn(existingTags)
        Mockito.`when`(tagDao.saveTags(anyList(), anyLong())).thenReturn(savedIds)

        tagService.addTagsToPlay(tags, nextLong())

        Mockito.verify(tagDao).saveTags(eq(tags.takeLast(2)), anyLong())
        Mockito.verify(tagDao).linkTagsToPlay(eq(existingTags.map { it.id!! } + savedIds), anyLong())
    }

    @Test
    fun `should link tags to play when saving all existing tags`() {
        val tags = listOf(randomText(), randomText(), randomText())
        val savedIds = emptyList<Id>()
        val existingTags = tags.map { Tag(nextLong(), it, nextLong()) }

        Mockito.`when`(tagDao.filterExistingTags(eq(tags), anyLong())).thenReturn(existingTags)
        Mockito.`when`(tagDao.saveTags(anyList(), anyLong())).thenReturn(savedIds)

        tagService.addTagsToPlay(tags, nextLong())

        Mockito.verify(tagDao).saveTags(eq(emptyList()), anyLong())
        Mockito.verify(tagDao).linkTagsToPlay(eq(existingTags.map { it.id!! }), anyLong())
    }
}
