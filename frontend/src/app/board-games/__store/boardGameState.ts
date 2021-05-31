import { BoardGame, SingleBoardGame } from "app/board-games/__models/BoardGameModels";

export interface BoardGameStore {
    list: BoardGame[];
    single?: SingleBoardGame;
    boardGameExists?: boolean;
}

export const boardGameInitialState: BoardGameStore = {
    list: [],
};
