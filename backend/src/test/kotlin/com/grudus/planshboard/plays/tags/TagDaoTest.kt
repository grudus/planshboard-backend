package com.grudus.planshboard.plays.tags

import com.grudus.planshboard.AbstractDatabaseTest
import com.grudus.planshboard.boardgames.BoardGameDao
import com.grudus.planshboard.commons.Id
import com.grudus.planshboard.plays.PlayDao
import com.grudus.planshboard.plays.model.CreatePlayRequest
import com.grudus.planshboard.tables.PlayTags.PLAY_TAGS
import com.grudus.planshboard.tables.Tags.TAGS
import com.grudus.planshboard.utils.randomText
import org.jooq.DSLContext
import org.jooq.exception.DataAccessException
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.springframework.beans.factory.annotation.Autowired

class TagDaoTest
@Autowired
constructor(private val tagDao: TagDao,
            private val dslContext: DSLContext,
            private val playDao: PlayDao,
            private val boardGameDao: BoardGameDao) : AbstractDatabaseTest() {


    @Test
    fun `should save tags and return it's id`() {
        val user = addUser()
        val ids = tagDao.saveTags(listOf(randomText(), randomText()), user)

        assertEquals(2, ids.size)
        assertEquals(2, dslContext.fetchCount(TAGS))
    }


    @Test
    fun `should link tags with play`() {
        val user = addUser()
        tagDao.saveTags(listOf(randomText()), user)
        val playId = createPlayForUser(user)

        val tagIds = tagDao.saveTags(listOf(randomText(), randomText(), randomText()), user)
        val linkedTags = tagIds.subList(1, tagIds.size)
        tagDao.linkTagsToPlay(linkedTags, playId)

        assertEquals(linkedTags.size, dslContext.fetchCount(PLAY_TAGS))
    }

    @Test
    fun `should not be able to save 2 tags with the same name`() {
        val user = addUser()
        val tagName = randomText()

        tagDao.saveTags(listOf(tagName), user)

        assertThrows<DataAccessException> {
            tagDao.saveTags(listOf(tagName), user)[0]
        }
    }


    @Test
    fun `should save 2 tags with the same name for different users`() {
        val user1 = addUser()
        val user2 = addUser()
        val tagName = randomText()

        val id1 = tagDao.saveTags(listOf(tagName), user1)[0]
        val id2 = tagDao.saveTags(listOf(tagName), user2)[0]

        assertNotEquals(id1, id2)
        assertEquals(2, dslContext.fetchCount(TAGS))
    }

    @Test
    fun `should filter existing tags`() {
        val user = addUser()
        val tag1Name = randomText()
        val tag2Name = randomText()

        val tagIds = tagDao.saveTags(listOf(tag1Name, randomText(), tag2Name), user)

        val filteredTags = tagDao.filterExistingTags(listOf(tag1Name, tag2Name), user)
        val filteredTagIds = filteredTags.map { it.id }

        assertEquals(2, filteredTags.size)
        assertTrue(tagIds.containsAll(filteredTagIds))
        assertTrue(filteredTags.all { it.creatorId == user })
    }

    @Test
    fun `should not find existing tags of another user`() {
        val user1 = addUser()
        val user2 = addUser()
        val tagName = randomText()

        tagDao.saveTags(listOf(tagName), user1)

        val filteredTags = tagDao.filterExistingTags(listOf(tagName), user2)

        assertTrue(filteredTags.isEmpty())
    }

    @Test
    fun `should return empty list when filtering empty list`() {
        val user = addUser()
        val tagName = randomText()

        tagDao.saveTags(listOf(tagName), user)

        val filteredTags = tagDao.filterExistingTags(listOf(), user)

        assertTrue(filteredTags.isEmpty())
    }

    @Test
    fun `should return empty list when filtering tags with non existing tags`() {
        val user = addUser()
        val tagName = randomText()

        tagDao.saveTags(listOf(tagName), user)

        val filteredTags = tagDao.filterExistingTags(listOf(randomText()), user)

        assertTrue(filteredTags.isEmpty())
    }

    @Test
    fun `should count tags without plays`() {
        val user = addUser()
        val tag1 = randomText()
        val tag2 = randomText()

        tagDao.saveTags(listOf(tag1, tag2), user)
        val tags = tagDao.getAllTagsWithPlaysCount(user)

        assertEquals(2, tags.size)
        tags.forEach {
            assertEquals(0, it.count)
        }
    }

    @Test
    fun `should count tags with number of linked plays`() {
        val user = addUser()
        val tag1 = randomText()
        val tag2 = randomText()
        val tag3 = randomText()
        val play1 = createPlayForUser(user)
        val play2 = createPlayForUser(user)

        val tagIds = tagDao.saveTags(listOf(tag1, tag2, tag3), user)
        tagDao.linkTagsToPlay(tagIds.drop(1), play1)
        tagDao.linkTagsToPlay(tagIds.drop(2), play2)

        val tags = tagDao.getAllTagsWithPlaysCount(user)

        assertEquals(3, tags.size)

        assertEquals(2, tags[0].count)
        assertEquals(tag3, tags[0].name)
        assertEquals(1, tags[1].count)
        assertEquals(tag2, tags[1].name)
        assertEquals(0, tags[2].count)
        assertEquals(tag1, tags[2].name)
    }

    @Test
    fun `should not count tags created by different user`() {
        val user1 = addUser()
        val userWithPlay = addUser()
        val tag = randomText()
        val play = createPlayForUser(userWithPlay)

        tagDao.saveTags(listOf(tag), user1)
        val tagIdLinkedToPlay = tagDao.saveTags(listOf(tag), userWithPlay)
        tagDao.linkTagsToPlay(tagIdLinkedToPlay, play)

        val tags = tagDao.getAllTagsWithPlaysCount(user1)

        assertEquals(1, tags.size)

        assertEquals(0, tags[0].count)
        assertEquals(tag, tags[0].name)
    }

    private fun createPlayForUser(user: Id): Id {
        val boardGameId = boardGameDao.create(user, randomText())
        return playDao.savePlayAlone(CreatePlayRequest(boardGameId, emptyList(), emptyList()))
    }
}
