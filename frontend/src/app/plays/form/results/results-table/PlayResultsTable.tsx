import React, { useCallback } from "react";
import css from "./play-results-table.module.scss";
import { BoardGamePlayResultsOptions } from "app/board-games/__models/BoardGameModels";
import useTranslations from "app/locale/__hooks/useTranslations";
import FlipMove from "react-flip-move";
import { PlayResultRow } from "app/plays/__models/PlayModels";
import PlayResultsRowElement from "./row/PlayResultsRowElement";

interface PlayResultsTableProps {
    results: PlayResultRow[];
    gameOptions: BoardGamePlayResultsOptions;
    onChange: (results: PlayResultRow[]) => void;
}

const PlayResultsTable: React.FC<PlayResultsTableProps> = props => {
    const { translate } = useTranslations();
    const { showPoints, showPosition } = props.gameOptions;

    const onRowChange = useCallback(
        (result: PlayResultRow) => {
            const copy = props.results.map(res => (res.opponent.id === result.opponent.id ? result : res));
            props.onChange(copy);
        },
        [props],
    );

    return (
        <table className={css.table}>
            <thead>
                <tr>
                    <th>{translate("PLAYS.FORM.RESULTS_TABLE.OPPONENT")}</th>
                    {showPosition && <th>{translate("PLAYS.FORM.RESULTS_TABLE.POSITION")}</th>}
                    {showPoints && <th className={css.pointsHeader}>{translate("PLAYS.FORM.RESULTS_TABLE.POINTS")}</th>}
                </tr>
            </thead>
            <FlipMove typeName="tbody">
                {props.results
                    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
                    .map(result => (
                        <PlayResultsRowElement
                            onChange={onRowChange}
                            key={result.opponent.id}
                            result={result}
                            gameOptions={props.gameOptions}
                            numberOfResults={props.results.length}
                        />
                    ))}
            </FlipMove>
        </table>
    );
};

export default React.memo(PlayResultsTable);
