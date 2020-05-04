import React, { forwardRef } from "react";
import { PlayResultRow } from "app/plays/__models/PlayModels";
import { BoardGamePlayResultsOptions } from "app/board-games/__models/BoardGameModels";
import LinkedUser from "app/opponents/linkedUser/LinkedUser";
import Input from "library/input/Input";
import css from "app/plays/form/results/results-table/play-results-table.module.scss";

interface PlayResultsRowProps {
    result: PlayResultRow;
    gameOptions: BoardGamePlayResultsOptions;
    numberOfResults: number;
    onChange: (row: PlayResultRow) => any;
}

const PlayResultsRowElement: React.FC<PlayResultsRowProps> = forwardRef<HTMLTableRowElement, PlayResultsRowProps>(
    (props, ref) => {
        const { result } = props;
        const { showPoints, showPosition } = props.gameOptions;
        const position = [...Array(props.numberOfResults).keys()].map((p, index) => `[${index + 1}]`);

        const pointsChange = (text: string) => {
            const copy = { ...result, points: parseInt(text, 10) };
            props.onChange(copy);
        };

        return (
            <tr key={result.opponent.id} ref={ref}>
                <td>
                    <span>{result.opponent.name}</span>
                    <LinkedUser opponent={result.opponent} />
                </td>
                {showPosition && <td>{position}</td>}
                {showPoints && (
                    <td>
                        <Input
                            name="points"
                            size="small"
                            type="number"
                            className={css.pointsInput}
                            onTextChange={pointsChange}
                        />
                    </td>
                )}
            </tr>
        );
    },
);

export default React.memo(PlayResultsRowElement);
