package com.grudus.planshboard.plays.tags

import com.grudus.planshboard.commons.Id
import com.grudus.planshboard.user.CurrentUserService
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class TagService
@Autowired
constructor(private val tagDao: TagDao,
            private val currentUserService: CurrentUserService) {
    private val log = LoggerFactory.getLogger(javaClass.simpleName)


    fun addTagsToPlay(tags: List<String>, playId: Id) {
        val userId = currentUserService.currentUserId()
        log.info("User[$userId] adds tags $tags to the play[$playId]")

        val existingTags: List<Tag> = tagDao.filterExistingTags(tags, userId)
        val existingTagNames = existingTags.map { tag -> tag.name }.toSet()
        val existingTagIds = existingTags.map { tag -> tag.id!! }.toList()

        val tagsToCreate = tags.filterNot { tag -> tag in existingTagNames }
        val createdTagIds = tagDao.saveTags(tagsToCreate, userId)

        tagDao.linkTagsToPlay(existingTagIds + createdTagIds, playId)
    }

    fun getAllTagsWithPlaysCount(): List<TagsCount> {
        val userId = currentUserService.currentUserId()
        return tagDao.getAllTagsWithPlaysCount(userId)
    }

}
