import { createAction } from "@reduxjs/toolkit";
import { TagCounts } from "app/plays/__models/TagModels";

export const getTagsSuccessAction = createAction<TagCounts[]>("GET_TAGS_WITH_COUNT");