import React from "react";
import BoardGameForm from "app/board-games/form/BoardGameForm";
import { useHistory } from "react-router-dom";
import { appRoutes } from "app/routing/routes";

const AddBoardGame: React.FC = () => {
    const history = useHistory();
    const onSubmit = (name: string) => {
        alert("Submit form " + name);
        onCancel();
    };
    const onCancel = () => {
        history.push(appRoutes.boardGames.list);
    };
    return <BoardGameForm title="Dodaj grę" onSubmit={onSubmit} onCancel={onCancel} />;
};

export default AddBoardGame;
