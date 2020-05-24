package com.grudus.planshboard.plays

import com.grudus.planshboard.commons.Id
import com.grudus.planshboard.plays.model.CreatePlayRequest
import com.grudus.planshboard.plays.tags.TagService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class PlayService
@Autowired
constructor(private val playDao: PlayDao,
            private val tagService: TagService) {

    fun createPlay(request: CreatePlayRequest): Id {
        val playId = playDao.savePlayAlone(request)
        playDao.savePlayResults(playId, request.results)
        tagService.addTagsToPlay(request.tags, playId)
        return playId
    }

}
