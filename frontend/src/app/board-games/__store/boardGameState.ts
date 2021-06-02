import { BoardGame, LinkedBoardGame, SingleBoardGame } from "app/board-games/__models/BoardGameModels";

export interface BoardGameStore {
    list: BoardGame[];
    linked: LinkedBoardGame[];
    single?: SingleBoardGame;
    boardGameExists?: boolean;
}

export const boardGameInitialState: BoardGameStore = {
    list: [],
    linked: [],
};
