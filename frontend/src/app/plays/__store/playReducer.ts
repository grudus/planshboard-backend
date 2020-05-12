import { TagCounts } from "app/plays/__models/TagModels";
import { createReducer, PayloadAction } from "@reduxjs/toolkit";
import { getTagsSuccessAction } from "app/plays/__store/playActions";

export interface PlayStore {
    tags: TagCounts[];
}

const initialState: PlayStore = {
    tags: [],
};

export const playReducer = createReducer<PlayStore>(initialState, {
    [getTagsSuccessAction.type]: (state, action: PayloadAction<TagCounts[]>) => ({
        ...state,
        tags: action.payload,
    }),
    APP_INITIALIZED: state => ({
        ...state,
        tags: [
            { name: "Koronawirus", count: 13 },
            { name: "kwarantanna", count: 256 },
            { name: "uro golca", count: 12 },
        ],
    }),
});
