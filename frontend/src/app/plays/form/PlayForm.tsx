import React from "react";
import { Opponent } from "app/opponents/__models/OpponentModels";
import css from "./play-form.module.scss";
import PlayResultsTable from "app/plays/form/results/results-table/PlayResultsTable";
import { defaultBoardGamePlayResultsOptions } from "app/board-games/__models/BoardGameModels";

interface PlayFormProps {
    possibleOpponents: Opponent[];
}

const PlayForm: React.FC<PlayFormProps> = props => {
    return (
        <form className={css.opponentsForm}>
            <PlayResultsTable
                selectedOpponents={props.possibleOpponents}
                gameOptions={defaultBoardGamePlayResultsOptions}
            />
        </form>
    );
};

export default PlayForm;
