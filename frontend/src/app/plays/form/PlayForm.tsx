import React, { useState } from "react";
import { Opponent } from "app/opponents/__models/OpponentModels";
import css from "./play-form.module.scss";
import PlayResultsTable from "app/plays/form/results/results-table/PlayResultsTable";
import { defaultBoardGamePlayResultsOptions } from "app/board-games/__models/BoardGameModels";
import PlayFormOpponents from "app/plays/form/play-form-opponents/PlayFormOpponents";

interface PlayFormProps {
    selectedOpponents: Opponent[];
}

const initialFrequentOpponents: Opponent[] = [
    { id: 3, name: "kamrat" },
    { id: 4, name: "bolec", linkedUser: { status: "ENABLED", userId: 3, userName: "boltzman" } },
    { id: 5, name: "ramzes" },
    { id: 6, name: "długie imie po co w ogóle takie wymyślać dla kogoś" },
    { id: 7, name: "Cezary Cezary" },
    { id: 8, name: "Mama Madzi" },
    { id: 2, name: "madzia", linkedUser: { status: "ENABLED", userId: 2, userName: "maddie" } },
];

const PlayForm: React.FC<PlayFormProps> = props => {
    const [frequentOpponents, setFrequentOpponents] = useState(initialFrequentOpponents);
    const [selectedOpponents, setSelectedOpponents] = useState(props.selectedOpponents);

    const selectOpponent = (op: Opponent) => {
        setFrequentOpponents(frequentOpponents.filter(o => o.id !== op.id));
        setSelectedOpponents([...selectedOpponents, op]);
    };

    return (
        <main>
            <PlayFormOpponents frequentOpponents={frequentOpponents} onSelect={selectOpponent} />
            <form className={css.opponentsForm}>
                <PlayResultsTable
                    selectedOpponents={selectedOpponents}
                    gameOptions={defaultBoardGamePlayResultsOptions}
                />
            </form>
        </main>
    );
};

export default PlayForm;
