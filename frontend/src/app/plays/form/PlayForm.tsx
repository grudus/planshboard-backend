import React, { useEffect, useState } from "react";
import { Opponent } from "app/opponents/__models/OpponentModels";
import css from "./play-form.module.scss";
import PlayResultsTable from "app/plays/form/results/results-table/PlayResultsTable";
import { defaultBoardGamePlayResultsOptions } from "app/board-games/__models/BoardGameModels";
import PlayFormOpponents from "app/plays/form/play-form-opponents/PlayFormOpponents";
import { PlayResultRow } from "app/plays/__models/PlayModels";
import { useRedux } from "store/rootReducer";

interface PlayFormProps {
    results: PlayResultRow[];
}

const PlayForm: React.FC<PlayFormProps> = props => {
    const frequent: Opponent[] = useRedux(state => state.opponent.frequentOpponents);
    const [frequentOpponents, setFrequentOpponents] = useState(frequent);
    const [results, setResults] = useState(props.results);

    useEffect(() => {
        setResults(props.results);
    }, [props.results]);

    const selectOpponent = (opponent: Opponent) => {
        setFrequentOpponents(frequentOpponents.filter(o => o.id !== opponent.id));
        setResults([...results, { opponent }]);
    };

    return (
        <main>
            <PlayFormOpponents frequentOpponents={frequentOpponents} onSelect={selectOpponent} />
            <form className={css.opponentsForm}>
                <PlayResultsTable
                    onChange={setResults}
                    gameOptions={defaultBoardGamePlayResultsOptions}
                    results={results}
                />
            </form>
        </main>
    );
};

export default React.memo(PlayForm);
