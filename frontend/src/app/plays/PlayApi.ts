import { ApiCall } from "app/shared/store/httpRequestActions";
import { apiRoutes } from "app/routing/routes";
import { SavePlayRequest } from "app/plays/__models/PlayModels";

const createPlay: ApiCall<SavePlayRequest> = request => ({
    type: "post",
    path: apiRoutes.play.create,
    body: request,
});

const getTags: ApiCall = () => ({
    type: "get",
    path: apiRoutes.tags.getWithPlaysCount,
});

const getAllPlays: ApiCall = () => ({
    type: "get",
    path: apiRoutes.play.list,
});

const PlayApi = { createPlay, getTags, getAllPlays };

export default PlayApi;
