import { TagCounts } from "app/plays/__models/TagModels";
import { createReducer, PayloadAction } from "@reduxjs/toolkit";
import { getAllPlaysAction, getTagsSuccessAction } from "app/plays/__store/playActions";
import { PlayListItem } from "app/plays/__models/PlayModels";

export interface PlayStore {
    tags: TagCounts[];
    list: PlayListItem[];
}

const initialState: PlayStore = {
    tags: [],
    list: [],
};

export const playReducer = createReducer<PlayStore>(initialState, {
    [getTagsSuccessAction.type]: (state, action: PayloadAction<TagCounts[]>) => ({
        ...state,
        tags: action.payload,
    }),
    [getAllPlaysAction.type]: (state, action: PayloadAction<PlayListItem[]>) => ({
        ...state,
        list: action.payload,
    }),
});
