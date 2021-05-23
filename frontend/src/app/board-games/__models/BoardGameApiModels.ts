import { BoardGamePlayResultsOptions } from "app/board-games/__models/BoardGameModels";
import { IdRequest } from "app/shared/models/Response";

export interface AddBoardGameRequest {
    name: string;
    options: BoardGamePlayResultsOptions;
}

export interface EditBoardGameRequest extends AddBoardGameRequest, IdRequest {}
