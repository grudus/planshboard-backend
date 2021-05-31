import { createSlice } from "@reduxjs/toolkit";
import { BoardGameActions } from "app/board-games/__store/boardGameActions";
import { boardGameInitialState } from "app/board-games/__store/boardGameState";

export const boardGamesSlice = createSlice({
    name: "boardGames",
    initialState: boardGameInitialState,
    reducers: {},
    extraReducers: builder =>
        builder
            .addCase(BoardGameActions.getBoardGames.fulfilled, (state, { payload }) => {
                state.list = payload;
                state.boardGameExists = !!payload.length;
            })
            .addCase(BoardGameActions.addBoardGame.fulfilled, (state, { payload }) => {
                state.list.push(payload);
                state.boardGameExists = true;
            })
            .addCase(BoardGameActions.getSingleBoardGame.fulfilled, (state, { payload }) => {
                state.single = payload;
            })
            .addCase(BoardGameActions.editBoardGame.fulfilled, (state, { payload }) => {
                const index = state.list.findIndex(game => game.id === payload.id);
                if (state.list[index]) state.list[index].name = payload.name;
            })
            .addCase(BoardGameActions.deleteBoardGame.fulfilled, (state, { payload }) => {
                const list = state.list.filter(game => game.id !== payload.id);
                state.list = list;
                state.boardGameExists = !!list.length;
            }),
});
