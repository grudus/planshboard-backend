package com.grudus.planshboard.plays

import com.grudus.planshboard.commons.Id
import com.grudus.planshboard.plays.model.PlayListItem
import com.grudus.planshboard.plays.model.SavePlayRequest
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

    fun createPlay(request: SavePlayRequest): Id {
        val playId = playDao.savePlayAlone(request)
        playDao.savePlayResults(playId, request.results)
        tagService.addTagsToPlay(request.tags, playId)
        return playId
    }

    fun updatePlay(playId: Id, request: SavePlayRequest) {
        playDao.updatePlayAlone(playId, request.date, request.note)
        playDao.removePlayResults(playId)
        playDao.savePlayResults(playId, request.results)
        tagService.resetTagsForPlay(request.tags, playId)
    }

    fun getPlays(userId: Id): List<PlayListItem> =
        playDao.getPlays(userId)

}
