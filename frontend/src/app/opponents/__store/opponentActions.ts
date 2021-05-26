import {
    Opponent,
    OpponentListItem,
    OpponentWithStats,
    SaveOpponentRequest,
} from "app/opponents/__models/OpponentModels";
import { baseHttpAction, passBodyAsResponse } from "app/shared/store/httpRequestActions";
import OpponentApi from "app/opponents/OpponentApi";
import { IdRequest } from "app/shared/models/Response";

const getAllOpponents = baseHttpAction<OpponentListItem[], void>("GET_ALL_OPPONENTS", OpponentApi.getAllOpponents);

const getFrequentOpponents = baseHttpAction<Opponent[], void>(
    "GET_FREQUENT_OPPONENTS",
    OpponentApi.getFrequentOpponents,
);

const getSingleOpponent = baseHttpAction<OpponentWithStats, IdRequest>(
    "GET_SINGLE_OPPONENT",
    OpponentApi.getSingleOpponent,
);

const createOpponent = baseHttpAction<Opponent, SaveOpponentRequest>(
    "CREATE_OPPONENT",
    OpponentApi.createOpponent,
    ({ id }, body) => ({
        id,
        name: body.opponentName,
    }),
);

const updateOpponent = baseHttpAction<SaveOpponentRequest>(
    "UPDATE_OPPONENT",
    OpponentApi.updateOpponent,
    passBodyAsResponse,
);

const OpponentActions = {
    getAllOpponents,
    getFrequentOpponents,
    getSingleOpponent,
    createOpponent,
    updateOpponent,
};

export default OpponentActions;
