import React from "react";
import BoardGameForm from "app/board-games/form/BoardGameForm";
import { useHistory } from "react-router-dom";
import { appRoutes } from "app/routing/routes";
import { useHttpDispatch } from "app/shared/store/httpRequestActions";
import { addBoardGameRequest } from "app/board-games/BoardGameApi";

const AddBoardGame: React.FC = () => {
    const history = useHistory();
    const dispatch = useHttpDispatch();

    const onSubmit = async (name: string) => {
        await addBoardGameRequest(dispatch, { name });
        onCancel();
    };
    const onCancel = () => {
        history.push(appRoutes.boardGames.list);
    };
    return <BoardGameForm title="Dodaj grę" onSubmit={onSubmit} onCancel={onCancel} />;
};

export default AddBoardGame;
