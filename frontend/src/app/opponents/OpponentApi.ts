import { ApiCall } from "app/shared/store/httpRequestActions";
import { apiRoutes } from "app/routing/routes";
import { SaveOpponentRequest } from "app/opponents/__models/OpponentModels";
import { IdRequest } from "app/shared/models/Response";

const getAllOpponents: ApiCall = () => ({
    type: "get",
    path: apiRoutes.opponent.list,
});

const getFrequentOpponents: ApiCall = () => ({
    type: "get",
    path: apiRoutes.opponent.frequent,
});

const getSingleOpponent: ApiCall<IdRequest> = request => ({
    type: "get",
    path: apiRoutes.opponent.single(request.id),
});

const createOpponent: ApiCall<SaveOpponentRequest> = request => ({
    type: "post",
    path: apiRoutes.opponent.create,
    body: request,
});

const updateOpponent: ApiCall<SaveOpponentRequest> = request => ({
    type: "put",
    path: apiRoutes.opponent.update(request.id!),
    body: request,
});

const OpponentApi = {
    getAllOpponents,
    getFrequentOpponents,
    getSingleOpponent,
    createOpponent,
    updateOpponent,
};

export default OpponentApi;
