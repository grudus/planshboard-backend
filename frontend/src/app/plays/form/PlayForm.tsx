import React, { useEffect, useState } from "react";
import { Opponent } from "app/opponents/__models/OpponentModels";
import css from "./play-form.module.scss";
import PlayResultsTable from "app/plays/form/results/results-table/PlayResultsTable";
import { BoardGameType, defaultRegularGameOptions } from "app/board-games/__models/BoardGameModels";
import PlayFormOpponents from "app/plays/form/play-form-opponents/PlayFormOpponents";
import { FinalResult, PlayMeta, PlayResultRow } from "app/plays/__models/PlayModels";
import { useRedux } from "store/rootReducer";
import PlayMetaFields from "app/plays/form/play-meta/PlayMetaFields";
import Button from "library/button/Button";
import useTranslations from "app/locale/__hooks/useTranslations";
import CooperativePlayResult from "app/plays/form/results/cooperative-play-result/CooperativePlayResult";

interface PlayFormProps {
    results: PlayResultRow[];
    meta?: PlayMeta;
    onSubmit: (results: PlayResultRow[], meta: PlayMeta) => Promise<any>;
    onCancel: () => void;
    loading: boolean;
}

const PlayForm: React.FC<PlayFormProps> = props => {
    const { translate } = useTranslations();
    const frequent: Opponent[] = useRedux(state => state.opponent.frequentOpponents);
    const gameOptions = useRedux(state => state.boardGame.single?.options ?? defaultRegularGameOptions);
    const [frequentOpponents, setFrequentOpponents] = useState(frequent);
    const [results, setResults] = useState(props.results);
    const [meta, setMeta] = useState(props.meta ?? { date: new Date() });
    const alreadyUsedOpponents = new Set(results.map(result => result.opponent.id));

    useEffect(() => {
        setResults(props.results);
    }, [props.results]);

    const selectOpponent = (opponent: Opponent) => {
        setFrequentOpponents(frequentOpponents.filter(o => o.id !== opponent.id));
        setResults([...results, { opponent }]);
    };

    const addDeletedOpponentToFrequentIfNecessary = (row: PlayResultRow) => {
        const initialFrequentIds = frequent.map(({ id }) => id);
        if (initialFrequentIds.includes(row.opponent.id)) {
            setFrequentOpponents([...frequentOpponents, row.opponent]);
        }
    };

    const fixOverflowedPositions = (results: PlayResultRow[]): PlayResultRow[] => {
        const maxPossiblePosition = results.length;
        return results.map(result => {
            const newPosition = (result.position ?? 0) > maxPossiblePosition ? undefined : result.position;
            return { ...result, position: newPosition };
        });
    };

    const deleteRow = (row: PlayResultRow) => {
        let updatedResults = results.filter(result => result.opponent.id !== row.opponent.id);
        updatedResults = fixOverflowedPositions(updatedResults);
        setResults(updatedResults);
        addDeletedOpponentToFrequentIfNecessary(row);
    };

    const changeFinalResult = (result: FinalResult) => {
        setMeta({ ...meta, finalResult: result });
    };

    return (
        <main>
            <PlayFormOpponents
                frequentOpponents={frequentOpponents}
                onSelect={selectOpponent}
                alreadyUsedOpponents={alreadyUsedOpponents}
            />
            <form className={css.opponentsForm}>
                <PlayResultsTable
                    onChange={setResults}
                    gameOptions={gameOptions}
                    results={results}
                    onDeleteRow={deleteRow}
                />
                {gameOptions.gameType === BoardGameType.COOPERATIVE && (
                    <CooperativePlayResult onChange={changeFinalResult} initialResult={meta.finalResult} />
                )}

                <PlayMetaFields onChange={setMeta} meta={meta} gameOptions={gameOptions} />

                <div className={css.buttonsWrapper}>
                    <Button text={translate("CANCEL")} decoration="outlined" onClick={props.onCancel} />
                    <Button
                        text={translate("SAVE")}
                        loading={props.loading}
                        onClick={() => props.onSubmit(results, meta)}
                    />
                </div>
            </form>
        </main>
    );
};

export default React.memo(PlayForm);
