package com.grudus.planshboard.plays.tags

import com.grudus.planshboard.commons.Id
import com.grudus.planshboard.commons.jooq.JooqCommons.insertMultipleAndReturnIds
import com.grudus.planshboard.tables.PlayTags.PLAY_TAGS
import com.grudus.planshboard.tables.Plays.PLAYS
import com.grudus.planshboard.tables.Tags.TAGS
import com.grudus.planshboard.tables.records.TagsRecord
import org.jooq.DSLContext
import org.jooq.impl.DSL
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Repository


@Repository
class TagDao
@Autowired
constructor(private val dsl: DSLContext) {

    fun saveTags(tags: List<String>, userId: Id): List<Id> {
        val tagRecords = tags.map { tag -> TagsRecord(null, userId, tag) }
        return insertMultipleAndReturnIds(dsl, TAGS, tagRecords)
    }

    fun linkTagsToPlay(tagIds: List<Id>, playId: Id) {
        val batch = dsl.batch(
            dsl.insertInto(PLAY_TAGS, PLAY_TAGS.PLAY_ID, PLAY_TAGS.TAG_ID)
                .values(null as Long?, null)
                .onDuplicateKeyIgnore()
        )

        tagIds.forEach { tagId ->
            batch.bind(playId, tagId)
        }

        batch.execute()
    }

    fun filterExistingTags(tags: List<String>, userId: Id): List<Tag> =
        dsl.selectFrom(TAGS)
            .where(TAGS.CREATOR_ID.eq(userId))
            .and(TAGS.NAME.`in`(tags))
            .fetchInto(Tag::class.java)


    fun getAllTagsWithPlaysCount(creatorId: Id): List<TagsCount> {
        val countField = DSL.count(PLAYS.ID).`as`("count")
        return dsl.select(TAGS.NAME, countField)
            .from(TAGS)
            .leftJoin(PLAY_TAGS).on(PLAY_TAGS.TAG_ID.eq(TAGS.ID))
            .leftJoin(PLAYS).on(PLAYS.ID.eq(PLAY_TAGS.PLAY_ID))
            .where(TAGS.CREATOR_ID.eq(creatorId))
            .groupBy(TAGS.NAME)
            .orderBy(countField.desc(), TAGS.NAME)
            .fetchInto(TagsCount::class.java)
    }

    fun removeTagsLinkedWithPlay(playId: Id) {
        dsl.deleteFrom(PLAY_TAGS)
            .where(PLAY_TAGS.PLAY_ID.eq(playId))
            .execute()
    }
}
