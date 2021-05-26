import { TagCounts } from "app/plays/__models/TagModels";
import { createReducer, PayloadAction } from "@reduxjs/toolkit";
import PlayActions from "app/plays/__store/playActions";
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
    [PlayActions.getTags.fulfilled.type]: (state, action: PayloadAction<TagCounts[]>) => ({
        ...state,
        tags: action.payload,
    }),
    [PlayActions.getAllPlays.fulfilled.type]: (state, action: PayloadAction<PlayListItem[]>) => ({
        ...state,
        list: action.payload,
    }),
});
