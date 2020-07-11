import { createAction } from "@reduxjs/toolkit";
import { TagCounts } from "app/plays/__models/TagModels";
import { PlayListItem } from "app/plays/__models/PlayModels";

export const getTagsSuccessAction = createAction<TagCounts[]>("GET_TAGS_WITH_COUNT");
export const savePlaySuccessAction = createAction("SAVE_PLAY_SUCCESS");
export const getAllPlaysAction = createAction<PlayListItem[]>("GET_ALL_PLAYS_SUCCESS");
