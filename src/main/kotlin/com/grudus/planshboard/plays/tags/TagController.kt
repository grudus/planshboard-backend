package com.grudus.planshboard.plays.tags

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/tags")
class TagController
@Autowired
constructor(private val tagService: TagService) {

    @GetMapping
    fun getAllTagsWithPlaysCount(): List<TagsCount> =
        tagService.getAllTagsWithPlaysCount()
}

