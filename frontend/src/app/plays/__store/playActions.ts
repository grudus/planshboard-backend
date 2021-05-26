import { TagCounts } from "app/plays/__models/TagModels";
import { PlayListItem } from "app/plays/__models/PlayModels";
import { baseHttpAction } from "app/shared/store/httpRequestActions";
import PlayApi from "app/plays/PlayApi";

const getTags = baseHttpAction<TagCounts[], void>("GET_TAGS_WITH_COUNT", PlayApi.getTags);

const savePlay = baseHttpAction("SAVE_PLAY", PlayApi.createPlay);

const getAllPlays = baseHttpAction<PlayListItem[], void>("GET_ALL_PLAYS", PlayApi.getAllPlays);

const PlayActions = {
    getTags,
    savePlay,
    getAllPlays,
};

export default PlayActions;
